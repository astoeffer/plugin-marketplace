# DGX-H100 / GPU Cluster Development Context

> NVIDIA DGX H100 "Deep-Thought" | 8xH100 GPUs | SLURM Scheduler | VS Code Remote SSH

## System Overview

```
┌─────────────────────────────────────────────────────┐
│              DEEP-THOUGHT (DGX H100)                │
│  ┌─────────────────────────────────────────────┐   │
│  │            8x NVIDIA H100 GPUs              │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │   │
│  │  │ H100│ │ H100│ │ H100│ │ H100│   ...    │   │
│  │  └─────┘ └─────┘ └─────┘ └─────┘          │   │
│  └─────────────────────────────────────────────┘   │
│                       │                             │
│  ┌─────────────────────────────────────────────┐   │
│  │              SLURM Scheduler                │   │
│  │    sbatch | squeue | scancel | sinfo       │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## SSH Configuration

```bash
# ~/.ssh/config
Host deep-thought
    HostName 141.31.112.54
    IdentityFile ~/.ssh/<private-key-file>
    User <username>

# Connect
ssh deep-thought
```

## SLURM Job Patterns

### Standard GPU Job

```bash
#!/bin/bash
#SBATCH --job-name=USERNAME_JOBNAME    # MUST prefix with username
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1                   # Request 1-8 GPUs
#SBATCH --cpus-per-task=4
#SBATCH --mem=32G
#SBATCH --time=04:00:00                # Max runtime
#SBATCH --output=slurm-%j.out
#SBATCH --error=slurm-%j.err

# Load modules
module load cuda/12.x
module load python/3.11

# Run task
python train.py
```

### Multi-GPU Job

```bash
#SBATCH --gres=gpu:4                   # 4 GPUs
#SBATCH --ntasks=4
#SBATCH --cpus-per-task=8

# Distributed training
torchrun --nproc_per_node=4 train_distributed.py
```

### Interactive Job

```bash
# Request interactive session with GPU
srun --partition=gpu --gres=gpu:1 --time=02:00:00 --pty bash

# Quick GPU test
srun --partition=gpu --gres=gpu:1 nvidia-smi
```

## Docker in SLURM

### CRITICAL: Cleanup Pattern

```bash
#!/bin/bash
#SBATCH --job-name=USERNAME_docker
#SBATCH --partition=gpu
#SBATCH --gres=gpu:1

# MANDATORY cleanup function
cleanup() {
    echo "Cleaning up Docker resources..."
    docker stop $(docker ps -q) 2>/dev/null || true
    docker rm $(docker ps -aq) 2>/dev/null || true
    # Remove dangling images (optional)
    docker image prune -f 2>/dev/null || true
}

# Register cleanup on exit/error
trap cleanup EXIT SIGINT SIGTERM

# Build inside job (not on login node!)
docker build -t myapp:latest .

# Run with GPU
docker run --gpus all --rm myapp:latest python train.py
```

### Docker + NVIDIA Container Toolkit

```bash
# Run with specific GPUs
docker run --gpus '"device=0,1"' \
    -v $(pwd):/workspace \
    -w /workspace \
    --rm myapp:latest python train.py
```

## VS Code Remote Development

### Setup Pattern

1. Install "Remote - SSH" extension
2. Configure `~/.ssh/config` (see above)
3. Connect: `Ctrl+Shift+P` → "Remote-SSH: Connect to Host" → "deep-thought"
4. Open folder: `/home/<username>/projects/`

### Dev Container in SLURM

```json
// .devcontainer/devcontainer.json
{
    "name": "DGX-H100 Dev",
    "build": {
        "dockerfile": "Dockerfile",
        "context": ".."
    },
    "runArgs": [
        "--gpus", "all",
        "--shm-size", "8g"
    ],
    "customizations": {
        "vscode": {
            "extensions": [
                "ms-python.python",
                "ms-toolsai.jupyter",
                "nvidia.nsight-vscode-edition"
            ]
        }
    },
    "postCreateCommand": "pip install -r requirements.txt"
}
```

## LLM Deployment Patterns

### Local Model Serving (vLLM)

```python
# SLURM job for vLLM server
#!/bin/bash
#SBATCH --job-name=USERNAME_vllm
#SBATCH --partition=gpu
#SBATCH --gres=gpu:2
#SBATCH --mem=64G
#SBATCH --time=08:00:00

python -m vllm.entrypoints.openai.api_server \
    --model mistralai/Mistral-7B-Instruct-v0.2 \
    --tensor-parallel-size 2 \
    --port 8000
```

### Text Generation Inference (TGI)

```bash
# Docker with TGI
docker run --gpus all \
    -p 8080:80 \
    -v $PWD/data:/data \
    ghcr.io/huggingface/text-generation-inference:latest \
    --model-id mistralai/Mistral-7B-Instruct-v0.2 \
    --num-shard 2
```

### Integration with PocketFlow

```python
from pocketflow import Node, Flow

class LocalLLMNode(Node):
    """Call local vLLM server on DGX"""
    def __init__(self, endpoint="http://localhost:8000/v1"):
        self.endpoint = endpoint

    def exec(self, prompt: str) -> str:
        import openai
        client = openai.OpenAI(
            base_url=self.endpoint,
            api_key="not-needed"  # Local server
        )
        response = client.chat.completions.create(
            model="mistral",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
```

## Resource Management

### Queue Status Commands

```bash
# Check job queue
squeue -u $USER

# Check cluster status
sinfo

# Cancel job
scancel <job_id>

# Job efficiency
seff <job_id>
```

### GPU Allocation Rules

| GPUs | Typical Use Case | Memory |
|------|-----------------|--------|
| 1 | Development, testing | 80GB |
| 2 | Medium models (7B-13B) | 160GB |
| 4 | Large models (30B-70B) | 320GB |
| 8 | Full cluster jobs | 640GB |

## Best Practices

1. **Always use job name prefix**: `USERNAME_description`
2. **Set realistic time limits**: Don't request 24h for 1h job
3. **Clean up Docker resources**: Use trap/cleanup pattern
4. **Don't build on login node**: Build inside SLURM jobs
5. **Use scratch storage**: For large datasets
6. **Request appropriate GPUs**: Start small, scale up

## Anti-Patterns

```bash
# WRONG: Building on login node
docker build -t myapp .  # DON'T do this outside SLURM

# WRONG: No cleanup
docker run myapp  # Containers left running

# WRONG: Over-requesting
#SBATCH --gres=gpu:8  # When you need 1

# WRONG: No job name prefix
#SBATCH --job-name=training  # Missing USERNAME_
```

## Monitoring

```bash
# GPU utilization (in job)
nvidia-smi --query-gpu=utilization.gpu --format=csv -l 1

# Memory usage
nvidia-smi --query-gpu=memory.used,memory.total --format=csv

# Watch mode
watch -n 1 nvidia-smi
```

## Reference
- DHBW Stuttgart DGX Documentation
- NVIDIA DGX H100 User Guide
- SLURM Documentation: https://slurm.schedmd.com/

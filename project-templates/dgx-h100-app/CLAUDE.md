# Project: DGX-H100 AI Application

> Auto-configured for GPU-accelerated AI development on DGX H100 cluster.

## Active Contexts
@~/.claude/contexts/pocketflow.md
@~/.claude/contexts/dgx-h100.md
@~/.claude/contexts/accessibility.md

## Project Specifics

**Cluster**: DGX H100 "Deep-Thought" (DHBW Stuttgart)
**GPUs**: 8x NVIDIA H100 (80GB each)
**Scheduler**: SLURM
**Framework**: PocketFlow + vLLM/TGI

## Enabled Plugins
- ai-app-dev (PocketFlow patterns, chatbot integration)

## Job Naming Convention
```
#SBATCH --job-name=[USERNAME]_[PROJECT]_[TASK]
Example: astoeff_chatbot_train
```

## Development Workflow
```
1. Local development (VS Code Remote SSH)
2. Test with srun --gres=gpu:1 (interactive)
3. Submit with sbatch (batch jobs)
4. Monitor with squeue -u $USER
```

## Quality Gates
```bash
# Python checks
pytest
mypy .
ruff check .

# GPU verification
srun --partition=gpu --gres=gpu:1 python -c "import torch; print(torch.cuda.is_available())"
```

## Docker Pattern
```bash
# Always use cleanup trap in SLURM jobs
trap 'docker stop $(docker ps -q); docker rm $(docker ps -aq)' EXIT
```

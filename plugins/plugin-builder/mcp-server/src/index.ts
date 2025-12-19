#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";

// Validation result types
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface PluginScanResult {
  skills: { name: string; path: string; hasValidFrontmatter: boolean }[];
  commands: { name: string; path: string; hasValidFrontmatter: boolean }[];
  agents: { name: string; path: string; hasValidFrontmatter: boolean }[];
  hasPluginJson: boolean;
  hasHooks: boolean;
  hasMcpConfig: boolean;
  emptyDirs: string[];
  issues: string[];
}

// Validation functions
function validatePluginJson(content: string): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  try {
    const json = JSON.parse(content);

    // Required fields
    if (!json.name) {
      result.errors.push("Missing required field: name");
      result.valid = false;
    } else if (!/^[a-z][a-z0-9-]*$/.test(json.name)) {
      result.errors.push(
        "Invalid name: must be lowercase, alphanumeric with hyphens"
      );
      result.valid = false;
    }

    if (!json.description) {
      result.errors.push("Missing required field: description");
      result.valid = false;
    }

    if (!json.version) {
      result.errors.push("Missing required field: version");
      result.valid = false;
    } else if (!/^[0-9]+\.[0-9]+\.[0-9]+(-[a-z0-9.]+)?$/.test(json.version)) {
      result.warnings.push(
        "Version should follow semantic versioning (e.g., 1.0.0)"
      );
    }

    if (!json.author || !json.author.name) {
      result.errors.push("Missing required field: author.name");
      result.valid = false;
    }

    // Optional field validation
    if (json.license && typeof json.license !== "string") {
      result.warnings.push("License should be a string (SPDX identifier)");
    }

    if (json.keywords && !Array.isArray(json.keywords)) {
      result.warnings.push("Keywords should be an array");
    }
  } catch (e) {
    result.errors.push(`Invalid JSON: ${(e as Error).message}`);
    result.valid = false;
  }

  return result;
}

function validateSkillMd(content: string): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  // Check for frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    result.errors.push(
      "Missing YAML frontmatter (must start with --- and end with ---)"
    );
    result.valid = false;
    return result;
  }

  const frontmatter = frontmatterMatch[1];

  // Check required fields
  if (!/^name:\s*.+$/m.test(frontmatter)) {
    result.errors.push("Missing required frontmatter field: name");
    result.valid = false;
  } else {
    const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
    if (nameMatch && !/^[a-z][a-z0-9-]*$/.test(nameMatch[1].trim())) {
      result.errors.push(
        "Invalid name: must be lowercase, alphanumeric with hyphens"
      );
      result.valid = false;
    }
  }

  if (!/^description:\s*.+$/m.test(frontmatter)) {
    result.errors.push("Missing required frontmatter field: description");
    result.valid = false;
  } else {
    const descMatch = frontmatter.match(/^description:\s*(.+)$/m);
    if (descMatch && descMatch[1].length > 1024) {
      result.errors.push("Description exceeds 1024 character limit");
      result.valid = false;
    }
    if (descMatch && descMatch[1].length < 20) {
      result.warnings.push(
        "Description is very short - consider adding trigger phrases"
      );
    }
  }

  return result;
}

function validateCommandMd(content: string): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  // Frontmatter is optional for commands
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];

    // If frontmatter exists, validate it
    try {
      // Basic YAML validation - check for common issues
      if (frontmatter.includes("\t")) {
        result.warnings.push("YAML frontmatter contains tabs - use spaces");
      }
    } catch (e) {
      result.errors.push(`Invalid frontmatter: ${(e as Error).message}`);
      result.valid = false;
    }
  } else {
    result.warnings.push(
      "No frontmatter found - consider adding description and argument-hint"
    );
  }

  if (content.trim().length < 10) {
    result.warnings.push("Command content is very short");
  }

  return result;
}

function validateAgentMd(content: string): ValidationResult {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  // Check for frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    result.errors.push(
      "Missing YAML frontmatter (must start with --- and end with ---)"
    );
    result.valid = false;
    return result;
  }

  const frontmatter = frontmatterMatch[1];

  // Check required fields
  if (!/^name:\s*.+$/m.test(frontmatter)) {
    result.errors.push("Missing required frontmatter field: name");
    result.valid = false;
  }

  if (!/^description:\s*.+$/m.test(frontmatter)) {
    result.errors.push("Missing required frontmatter field: description");
    result.valid = false;
  }

  // Check optional but recommended fields
  if (!/^tools:\s*.+$/m.test(frontmatter)) {
    result.warnings.push(
      "No tools specified - agent will inherit all tools from conversation"
    );
  }

  if (!/^model:\s*.+$/m.test(frontmatter)) {
    result.warnings.push("No model specified - defaults to sonnet");
  }

  return result;
}

function scanPluginStructure(pluginPath: string): PluginScanResult {
  const result: PluginScanResult = {
    skills: [],
    commands: [],
    agents: [],
    hasPluginJson: false,
    hasHooks: false,
    hasMcpConfig: false,
    emptyDirs: [],
    issues: [],
  };

  // Check plugin.json
  const pluginJsonPath = path.join(pluginPath, ".claude-plugin", "plugin.json");
  result.hasPluginJson = fs.existsSync(pluginJsonPath);
  if (!result.hasPluginJson) {
    result.issues.push("Missing .claude-plugin/plugin.json");
  }

  // Scan skills
  const skillsDir = path.join(pluginPath, "skills");
  if (fs.existsSync(skillsDir)) {
    const skillEntries = fs.readdirSync(skillsDir, { withFileTypes: true });

    for (const entry of skillEntries) {
      if (entry.isDirectory()) {
        const skillMdPath = path.join(skillsDir, entry.name, "SKILL.md");
        if (fs.existsSync(skillMdPath)) {
          const content = fs.readFileSync(skillMdPath, "utf-8");
          const validation = validateSkillMd(content);
          result.skills.push({
            name: entry.name,
            path: skillMdPath,
            hasValidFrontmatter: validation.valid,
          });
        } else {
          result.issues.push(
            `Skill directory ${entry.name} missing SKILL.md file`
          );
        }
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        result.issues.push(
          `Flat skill file found: skills/${entry.name} - should be skills/${entry.name.replace(".md", "")}/SKILL.md`
        );
      }
    }
  }

  // Scan commands
  const commandsDir = path.join(pluginPath, "commands");
  if (fs.existsSync(commandsDir)) {
    const scanCommands = (dir: string, prefix = "") => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      let hasContent = false;

      for (const entry of entries) {
        if (entry.isDirectory()) {
          scanCommands(
            path.join(dir, entry.name),
            prefix ? `${prefix}:${entry.name}` : entry.name
          );
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          hasContent = true;
          const cmdPath = path.join(dir, entry.name);
          const content = fs.readFileSync(cmdPath, "utf-8");
          const validation = validateCommandMd(content);
          const cmdName = prefix
            ? `${prefix}:${entry.name.replace(".md", "")}`
            : entry.name.replace(".md", "");
          result.commands.push({
            name: cmdName,
            path: cmdPath,
            hasValidFrontmatter: validation.valid,
          });
        }
      }

      if (!hasContent && dir === commandsDir) {
        result.emptyDirs.push("commands/");
      }
    };
    scanCommands(commandsDir);
  }

  // Scan agents
  const agentsDir = path.join(pluginPath, "agents");
  if (fs.existsSync(agentsDir)) {
    const entries = fs.readdirSync(agentsDir, { withFileTypes: true });
    let hasContent = false;

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".md")) {
        hasContent = true;
        const agentPath = path.join(agentsDir, entry.name);
        const content = fs.readFileSync(agentPath, "utf-8");
        const validation = validateAgentMd(content);
        result.agents.push({
          name: entry.name.replace(".md", ""),
          path: agentPath,
          hasValidFrontmatter: validation.valid,
        });
      }
    }

    if (!hasContent) {
      result.emptyDirs.push("agents/");
    }
  }

  // Check hooks
  result.hasHooks = fs.existsSync(path.join(pluginPath, "hooks", "hooks.json"));

  // Check MCP config
  result.hasMcpConfig = fs.existsSync(path.join(pluginPath, ".mcp.json"));

  return result;
}

function generatePluginJson(pluginPath: string): string {
  const scan = scanPluginStructure(pluginPath);
  const dirName = path.basename(pluginPath);

  const manifest = {
    name: dirName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    version: "1.0.0",
    description: `[TODO: Add description for ${dirName}]`,
    author: {
      name: "[TODO: Add author name]",
    },
    license: "MIT",
    keywords: [] as string[],
    ...(scan.skills.length > 0 && { skills: "./skills/" }),
    ...(scan.commands.length > 0 && { commands: "./commands/" }),
    ...(scan.agents.length > 0 && { agents: "./agents/" }),
  };

  return JSON.stringify(manifest, null, 2);
}

// Create the MCP server
const server = new Server(
  {
    name: "plugin-validator",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "validate_plugin_json",
      description:
        "Validate a plugin.json manifest file content against Claude Code requirements",
      inputSchema: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "The JSON content of the plugin.json file",
          },
        },
        required: ["content"],
      },
    },
    {
      name: "validate_skill_md",
      description:
        "Validate a SKILL.md file content for proper frontmatter and structure",
      inputSchema: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "The content of the SKILL.md file",
          },
        },
        required: ["content"],
      },
    },
    {
      name: "validate_command_md",
      description: "Validate a command markdown file for proper structure",
      inputSchema: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "The content of the command .md file",
          },
        },
        required: ["content"],
      },
    },
    {
      name: "validate_agent_md",
      description:
        "Validate an agent markdown file for required frontmatter fields",
      inputSchema: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "The content of the agent .md file",
          },
        },
        required: ["content"],
      },
    },
    {
      name: "scan_plugin_structure",
      description:
        "Scan a plugin directory and return its structure and any issues found",
      inputSchema: {
        type: "object",
        properties: {
          pluginPath: {
            type: "string",
            description: "Absolute path to the plugin directory",
          },
        },
        required: ["pluginPath"],
      },
    },
    {
      name: "generate_plugin_json",
      description:
        "Generate a plugin.json manifest based on discovered components in a plugin directory",
      inputSchema: {
        type: "object",
        properties: {
          pluginPath: {
            type: "string",
            description: "Absolute path to the plugin directory",
          },
        },
        required: ["pluginPath"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "validate_plugin_json": {
      const result = validatePluginJson(args?.content as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "validate_skill_md": {
      const result = validateSkillMd(args?.content as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "validate_command_md": {
      const result = validateCommandMd(args?.content as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "validate_agent_md": {
      const result = validateAgentMd(args?.content as string);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "scan_plugin_structure": {
      const pluginPath = args?.pluginPath as string;
      if (!fs.existsSync(pluginPath)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `Path not found: ${pluginPath}` }),
            },
          ],
        };
      }
      const result = scanPluginStructure(pluginPath);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    case "generate_plugin_json": {
      const pluginPath = args?.pluginPath as string;
      if (!fs.existsSync(pluginPath)) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `Path not found: ${pluginPath}` }),
            },
          ],
        };
      }
      const result = generatePluginJson(pluginPath);
      return {
        content: [{ type: "text", text: result }],
      };
    }

    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Plugin Validator MCP Server running on stdio");
}

main().catch(console.error);

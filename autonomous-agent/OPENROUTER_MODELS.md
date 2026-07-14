# OpenRouter Model Options

The agent is configured to use OpenRouter, which gives you access to many powerful AI models. You can change the model in your `.env` file.

## Current Configuration

Default model: `deepseek/deepseek-chat`

## Recommended Models for Website Generation

### Budget-Friendly (Best Value)

1. **DeepSeek Chat** (Default)
   ```
   OPENROUTER_MODEL=deepseek/deepseek-chat
   ```
   - Cost: ~$0.14 per 1M tokens (input), ~$0.28 per 1M tokens (output)
   - Very cost-effective
   - Good quality for HTML generation
   - Fast response times
   - **Recommended for production**

2. **DeepSeek V3**
   ```
   OPENROUTER_MODEL=deepseek/deepseek-r1
   ```
   - Similar pricing to DeepSeek Chat
   - Reasoning model, may produce better results
   - Slightly slower

### Mid-Tier (Better Quality)

3. **Gemini Flash**
   ```
   OPENROUTER_MODEL=google/gemini-flash-1.5
   ```
   - Cost: ~$0.075 per 1M tokens (input), ~$0.30 per 1M tokens (output)
   - Fast and efficient
   - Good at following instructions
   - Free tier available

4. **Claude Haiku**
   ```
   OPENROUTER_MODEL=anthropic/claude-3-haiku
   ```
   - Cost: ~$0.25 per 1M tokens (input), ~$1.25 per 1M tokens (output)
   - Fast responses
   - Good quality
   - Reliable

### Premium (Highest Quality)

5. **Claude Sonnet 3.5**
   ```
   OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
   ```
   - Cost: ~$3 per 1M tokens (input), ~$15 per 1M tokens (output)
   - Excellent quality
   - Great at design and HTML
   - **Best for high-value leads**

6. **GPT-4**
   ```
   OPENROUTER_MODEL=openai/gpt-4
   ```
   - Cost: ~$5 per 1M tokens (input), ~$15 per 1M tokens (output)
   - High quality
   - Slower responses
   - Good at creative tasks

## Cost Calculations

Based on generating 50 websites per day with ~4000 tokens per website:

### DeepSeek Chat (Default)
- Per website: ~$0.0011
- Per day (50 sites): ~$0.055
- Per month (1500 sites): ~$1.65
- **~$20/year for 1000s of leads**

### Claude Sonnet 3.5
- Per website: ~$0.036
- Per day (50 sites): ~$1.80
- Per month (1500 sites): ~$54
- **~$650/year**

### GPT-4
- Per website: ~$0.048
- Per day (50 sites): ~$2.40
- Per month (1500 sites): ~$72
- **~$870/year**

## How to Change Models

1. Open your `.env` file
2. Find the line: `OPENROUTER_MODEL=deepseek/deepseek-chat`
3. Replace with your chosen model
4. Restart the agent

Example:
```bash
# Change to Claude Sonnet
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Change to Gemini Flash
OPENROUTER_MODEL=google/gemini-flash-1.5
```

## Testing Different Models

You can test different models before committing:

```bash
# Edit .env to change model
nano .env

# Run test with 2 websites
npm test

# Review results in CRM
# If satisfied, run full agent
npm start
```

## Model Selection Tips

**For high-volume, budget-conscious:**
- Use DeepSeek Chat (default)
- Cost: ~$20/year for thousands of sites
- Quality: Good enough for most SMBs

**For premium clients:**
- Use Claude Sonnet 3.5
- Cost: ~$650/year
- Quality: Exceptional designs

**For mixed approach:**
- Run agent with DeepSeek for most leads
- Manually regenerate important leads with Claude Sonnet
- Use approval queue to select which ones to upgrade

## Multiple Model Strategy

You can even run multiple instances:

```bash
# Instance 1: Budget leads with DeepSeek
OPENROUTER_MODEL=deepseek/deepseek-chat
DAILY_WEBSITE_LIMIT=45

# Instance 2: Premium leads with Claude
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
DAILY_WEBSITE_LIMIT=5
```

## More Models

See full list at: https://openrouter.ai/models

Popular options:
- `meta-llama/llama-3.1-70b-instruct` - Open source, good quality
- `mistralai/mistral-large` - European alternative
- `perplexity/llama-3.1-sonar-large` - Search-optimized

## Notes

- OpenRouter handles rate limiting automatically
- Credits are shared across all models
- No need to manage multiple API keys
- Pay-as-you-go pricing
- Free credits available for new users

---

**Recommendation**: Start with DeepSeek Chat (default). It's incredibly cost-effective and produces quality results. Upgrade to Claude Sonnet only if you need premium quality for high-value clients.

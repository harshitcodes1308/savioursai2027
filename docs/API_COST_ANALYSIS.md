# API Cost Analysis - ICSE Saviours

## OpenAI API Usage & Costs

### Model Used
**GPT-4o-mini** - Used across all AI features

### Current Pricing (as of 2024)
- **Input**: $0.150 per 1M tokens
- **Output**: $0.600 per 1M tokens

### Feature Breakdown

#### 1. **Ask Doubt (AI Assistant Chat)**
**File**: `src/lib/ai.ts` → `askAI()`

**Token Estimation Per Query:**
- System Prompt: ~560 tokens (large, detailed prompt)
- User Question: ~20-100 tokens (average: 50)
- Conversation History: ~0-500 tokens (varies)
- **Total Input**: ~610-1160 tokens (avg: **885 tokens**)
- Max Output: 500 tokens (capped)
- **Total Output**: ~200-500 tokens (avg: **350 tokens**)

**Cost Per Query:**
```
Input:  885 tokens × $0.15 / 1M = $0.0001328
Output: 350 tokens × $0.60 / 1M = $0.0002100
TOTAL: $0.0003428 (~$0.00034 per question)
```

**Monthly Estimate (100 users, 5 queries/day):**
- Daily: 500 queries × $0.00034 = **$0.17**
- Monthly: **$5.10**

---

#### 2. **Generate Flashcards**
**File**: `src/lib/ai.ts` → `generateFlashcards()`

**Token Estimation Per Generation:**
- System Prompt: ~180 tokens
- User Prompt (with requirements): ~550 tokens
- User Topics Input: ~20-50 tokens (avg: 35)
- **Total Input**: ~765 tokens
- Output (10 MCQs with JSON): ~1500-2000 tokens (avg: **1750 tokens**)

**Cost Per Generation:**
```
Input:  765 tokens × $0.15 / 1M = $0.0001148
Output: 1750 tokens × $0.60 / 1M = $0.0010500
TOTAL: $0.0011648 (~$0.00116 per flashcard generation)
```

**Monthly Estimate (100 users, 2 flashcard sessions/week):**
- Weekly: 200 sessions × $0.00116 = **$0.23**
- Monthly: **$0.93**

---

#### 3. **Generate Study Plan**
**File**: `src/lib/ai.ts` → `generateStudyPlan()`

**Token Estimation Per Plan:**
- System Prompt: ~70 tokens
- User Prompt Template: ~150 tokens
- User Parameters: ~50-100 tokens (subjects, dates)
- **Total Input**: ~270 tokens
- Output (Week-by-week JSON): ~600-1000 tokens (avg: **800 tokens**)

**Cost Per Plan:**
```
Input:  270 tokens × $0.15 / 1M = $0.0000405
Output: 800 tokens × $0.60 / 1M = $0.0004800
TOTAL: $0.0005205 (~$0.00052 per plan)
```

**Monthly Estimate (100 users, 1 plan/month):**
- Monthly: 100 plans × $0.00052 = **$0.05**

---

#### 4. **Summarize Content**
**File**: `src/lib/ai.ts` → `summarizeContent()`

**Token Estimation Per Summary:**
- System Prompt: ~60 tokens
- User Prompt: ~100 tokens
- Content Input: ~500-1500 tokens (avg: 1000)
- **Total Input**: ~1160 tokens
- Max Output: 400 tokens (capped)
- **Total Output**: ~300 tokens (avg)

**Cost Per Summary:**
```
Input:  1160 tokens × $0.15 / 1M = $0.0001740
Output: 300 tokens × $0.60 / 1M = $0.0001800
TOTAL: $0.0003540 (~$0.00035 per summary)
```

**Monthly Estimate (100 users, 3 summaries/month):**
- Monthly: 300 summaries × $0.00035 = **$0.11**

---

#### 5. **Generate Practice Questions**
**File**: `src/lib/ai.ts` → `generateQuestions()`

**Token Estimation Per Generation:**
- System Prompt: ~60 tokens
- User Prompt: ~120 tokens
- **Total Input**: ~180 tokens
- Output (varies by count, assume 5 questions): ~800 tokens

**Cost Per Generation:**
```
Input:  180 tokens × $0.15 / 1M = $0.0000270
Output: 800 tokens × $0.60 / 1M = $0.0004800
TOTAL: $0.0005070 (~$0.00051 per question batch)
```

**Monthly Estimate (100 users, 2 batches/week):**
- Weekly: 200 batches × $0.00051 = **$0.10**
- Monthly: **$0.41**

---

### **Total OpenAI Monthly Cost Estimate**

| Feature | Monthly Cost |
|---------|--------------|
| Ask Doubt (Chat) | $5.10 |
| Flashcards | $0.93 |
| Study Plan | $0.05 |
| Summarize | $0.11 |
| Practice Questions | $0.41 |
| **TOTAL** | **$6.60** |

**For 100 active users**

### Scaling Estimates

| Users | Monthly Cost |
|-------|--------------|
| 100 | $6.60 |
| 500 | $33.00 |
| 1,000 | $66.00 |
| 5,000 | $330.00 |
| 10,000 | $660.00 |

---

## YouTube API Usage & Costs

### API Used
**YouTube Data API v3**

### Current Pricing
- **Free Tier**: 10,000 quota units/day
- **After Free Tier**: $0.00 (YouTube API is FREE after quota)
- **Quota Reset**: Daily

### Quota Costs Per Operation

**File**: `src/lib/youtube.ts` → `searchRelevantVideos()`

**Per Search Request:**
- `youtube.search.list()` = **100 quota units**
- Your app calls it **2 times per user query** (Clarify Knowledge + ICSE Saviours)
- **Total**: 200 quota units per user query

### Daily Quota Analysis

**Free Tier Limit**: 10,000 units/day

| Daily User Queries | Quota Used | Fits in Free Tier? |
|-------------------|------------|-------------------|
| 10 | 2,000 | ✅ Yes |
| 25 | 5,000 | ✅ Yes |
| 50 | 10,000 | ✅ Yes (exactly) |
| 100 | 20,000 | ❌ No - exceeds by 10k |
| 500 | 100,000 | ❌ No - exceeds by 90k |

### **YouTube Monthly Cost Estimate**

**YouTube Data API v3 is FREE** - No cost after quota limits.

**However, you hit limits at:**
- **50 video searches/day** = Free tier limit
- Beyond 50/day, video recommendations won't load (will show fallback links)

### Solutions for Scaling YouTube

1. **Request Quota Increase** (Free via Google Cloud Console)
2. **Implement Caching** - Cache popular video results
3. **Smart Rate Limiting** - Limit to 2-3 videos per user per day
4. **Fallback Strategy** - Already implemented (shows channel links)

---

## Total Monthly API Costs Summary

### For 100 Active Users

| API | Monthly Cost | Notes |
|-----|--------------|-------|
| OpenAI (GPT-4o-mini) | $6.60 | Scales linearly |
| YouTube Data API | $0.00 | Free (if under 50 searches/day) |
| **TOTAL** | **$6.60/month** | ~$0.066 per user |

### Cost Per User Per Month
**$0.066** (~6.6 cents)

### Break-Even Analysis

To cover $6.60/month in API costs:
- If charging $1/month per user → Need 7 paying users
- If charging $5/month per user → Need 2 paying users
- If charging $10/month per user → Need 1 paying user

---

## Recommendations

### 1. **Monitor Usage**
Currently logging is in place (`aiUsageLog` in database) - great!

### 2. **Optimize High-Cost Features**
- **Ask Doubt** is 77% of OpenAI costs ($5.10 / $6.60)
- Consider caching common questions
- Limit conversation history to last 5 messages

### 3. **YouTube Quota Management**
- Request quota increase from Google (free process)
- Implement Redis caching for popular searches
- Current fallback strategy is good

### 4. **Rate Limiting**
Consider limits per user:
- 50 AI questions/day
- 10 flashcard generations/week
- 5 video searches/day

### 5. **Pricing Strategy**
Your API costs are **very low** ($0.066/user/month)

Suggested pricing:
- Free tier: 5 AI questions/day
- Premium ($4.99/month): Unlimited + Flashcards
- Profit margin: 98.6% 🎉

---

## Current Implementation Notes

✅ **Good Practices Already Implemented:**
- Using GPT-4o-mini (cheapest model)
- Token limits on outputs (`max_tokens: 500`, `400`)
- AI usage logging in database
- YouTube fallback when quota exceeded
- Temperature optimization (0.3-0.7 range)

⚠️ **Potential Optimizations:**
- Trim conversation history to reduce tokens
- Cache flashcard responses for common topics
- Implement response streaming for better UX
- Add user-level rate limiting

---

**Last Updated**: January 2026  
**Model**: GPT-4o-mini  
**YouTube API**: v3

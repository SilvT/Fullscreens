# Portfolio Analytics Implementation Guide
## Track Visitors & Job Application Performance

---

## Phase 1: Basic Setup (15 minutes)

### Step 1: Enable Vercel Analytics

1. Go to your Vercel dashboard
2. Select your portfolio project
3. Click **Analytics** tab
4. Click "Enable Analytics"
5. Choose the free plan (2,500 events/month is plenty for a portfolio)
6. Install the package in your project:

```bash
npm install @vercel/analytics
```

7. Add to your main layout/app file:

```javascript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

8. Commit and push to trigger deployment

---

### Step 2: Set Up Event Tracking for Key Actions

Add custom events to track what matters for job applications:

```javascript
import { track } from '@vercel/analytics';

// When someone downloads your CV
<button onClick={() => {
  track('cv_download', { format: 'pdf' });
  // your download logic
}}>
  Download CV
</button>

// When someone submits contact form
function handleContactSubmit(e) {
  track('contact_form_submit', { 
    source: 'portfolio'
  });
  // your form logic
}

// When someone clicks external links
<a 
  href="https://linkedin.com/in/yourprofile"
  onClick={() => track('external_link_click', { 
    platform: 'linkedin' 
  })}
>
  LinkedIn
</a>

// Track project case study views
useEffect(() => {
  track('project_view', { 
    project_name: 'Design System Distributor'
  });
}, []);
```

---

## Phase 2: Manual Application Tracking (10 minutes)

### Step 3: Create a Job Application Tracker

Create a simple spreadsheet or Notion database with these columns:

| Date Applied | Company | Role | Application URL | Portfolio Sent? | Notes |
|--------------|---------|------|-----------------|-----------------|-------|
| 2025-11-25 | Example Co | UI Designer | example.com/jobs | ✓ | Sent via LinkedIn |

This helps you correlate traffic spikes with specific applications.

---

### Step 4: Create a Traffic Monitoring Routine

**Set up a simple tracking system:**

Create a Google Sheet or Notion page titled "Portfolio Analytics Log" with these columns:

| Date | Daily Visitors | CV Downloads | Contact Forms | Notable Companies (if identifiable) | Applications Sent That Week |
|------|----------------|--------------|---------------|-------------------------------------|----------------------------|
| 2025-11-25 | 15 | 2 | 1 | Tech Co, Design Studio | 5 |

**Update this weekly** (every Monday morning) by checking your Vercel Analytics dashboard.

---

## Phase 3: What to Monitor During Active Applications

### Daily Checks (2 minutes/day)

In your Vercel Analytics dashboard, look at:

1. **Visitors count** - Any spikes?
2. **Top pages** - Which projects are getting views?
3. **Custom events** - Any CV downloads or contact form submissions?

---

### Weekly Analysis (10 minutes/week)

Create a simple review routine:

**Every Monday:**
1. Export or screenshot your Vercel Analytics data
2. Note in your tracker:
   - Total visitors vs previous week
   - Which projects got the most views
   - Any CV downloads
   - Any contact form submissions
3. Cross-reference with applications you sent that week
4. Look for patterns:
   - Did you get traffic spike 1-3 days after applying?
   - Which projects caught attention?
   - Did anyone download your CV?

---

## Phase 4: Advanced Tracking (Optional, 30 minutes)

### Step 5: Add UTM Parameters to Application Links

When you send your portfolio link in applications, add tracking parameters:

```
https://silviatravieso.es/?utm_source=application&utm_medium=email&utm_campaign=company_name
```

This helps you see which applications drove traffic. You can create these systematically:

- **For LinkedIn applications**: `?utm_source=linkedin&utm_campaign=company_name`
- **For email applications**: `?utm_source=email&utm_campaign=company_name`
- **For application portals**: `?utm_source=portal&utm_campaign=company_name`

Vercel Analytics will show these in the "Referrers" section.

---

### Step 6: Set Up Alerts (Optional)

If you want real-time notifications:

1. Use Vercel's webhooks or
2. Set up a simple notification system:

Create a small serverless function that emails you when there's unusual activity:

```javascript
// api/notify-traffic-spike.js
export default async function handler(req, res) {
  // Check analytics API
  // If spike detected, send yourself an email via Resend/SendGrid
}
```

---

## What Each Metric Tells You

| Signal | What It Means |
|--------|---------------|
| **Traffic spike 1-3 days after application** | Recruiter/hiring manager viewed your portfolio ✅ |
| **Multiple page views in one session** | They're genuinely interested, exploring your work 💚 |
| **CV download** | Strong interest, they're saving your info 🎯 |
| **Contact form submission** | Very strong signal, they want to reach out directly 🌟 |
| **High bounce rate on homepage** | Your intro/hero section might need work ⚠️ |
| **Long time on case study pages** | They're reading your process, very good sign 📖 |
| **Traffic from specific location** | Correlate with company office locations 🌍 |

---

## Sample Weekly Workflow

### Monday Morning Routine (10 minutes)

1. Open Vercel Analytics dashboard (2 min)
2. Note key numbers in your tracker (3 min)
3. Compare with last week (2 min)
4. Cross-reference with applications sent (3 min)
5. Adjust portfolio if needed based on insights (optional)

### When You Send an Application

1. Add UTM parameter to your portfolio link
2. Log it in your application tracker
3. Note the date so you can watch for traffic in next 3-5 days

---

## Quick Win: Minimum Viable Setup (30 minutes total)

1. ✓ Enable Vercel Analytics
2. ✓ Add CV download tracking
3. ✓ Create simple spreadsheet tracker
4. ✓ Done!

You'll immediately start collecting data, and by the time you're actively applying, you'll have baseline metrics to compare against.

---

## Key Metrics to Track for Job Applications

### Traffic Patterns
- Which pages get the most views (which projects recruiters find interesting)
- Traffic sources (LinkedIn, direct links, referrals)
- Geographic location of visitors (are companies in your target locations viewing it?)

### Engagement Signals
- Time on page (are they actually reading your case studies?)
- Bounce rate (are they immediately leaving?)
- Pages per session (are they exploring multiple projects?)

### Performance Metrics
- Page load times (crucial for demonstrating technical competence)
- Core Web Vitals scores
- Mobile vs desktop usage

### Conversion Tracking
- Contact form submissions
- CV/resume downloads
- Links clicked to external profiles (LinkedIn, GitHub)

---

## Analytics Tools Comparison

### Vercel Analytics (Recommended for Start)
- Already integrated if you enable it in your Vercel dashboard
- Privacy-friendly, no cookie banners needed
- Tracks Web Vitals (Core Web Vitals are important for performance)
- Free tier: 2,500 events/month
- Shows page views, visitors, and performance metrics

### Plausible or Fathom Analytics (Privacy-Focused)
- Lightweight, GDPR-compliant
- No cookie banners required
- Clean dashboards, easy to read
- Paid but affordable (~£9/month)

### Google Analytics 4 (If You Want Depth)
- Free and comprehensive
- More complex to set up
- Requires cookie consent banner (GDPR)
- Good if you want detailed user journey data

---

## Notes

- Start simple with Vercel Analytics
- Add complexity only when needed
- Focus on actionable metrics (CV downloads, contact forms)
- Correlate traffic with applications sent
- Use data to improve portfolio, not just to collect numbers

---

**Created for portfolio analytics tracking during job search**

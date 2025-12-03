# Megabyte Mentors - Transition Plan

**Project:** Megabyte Mentors Platform (Capstone Project)
**Date:** November 28, 2025
**Prepared For:** Client Handoff
**Team:** Development Team

---

## Executive Summary

This document outlines the plan for transitioning the Megabyte Mentors platform from our development team to the client (Sheridan College).

**Project Context:**
Megabyte Mentors is an internal Sheridan College application designed to facilitate mentor-student connections and event management. As a capstone project, this implementation focuses on delivering a **functional prototype** that demonstrates core features and serves as a foundation for stakeholder approval and future integration with Sheridan's enterprise systems.

**Scope & Strategic Decisions:**
Due to project timeline and resource constraints, our team prioritized implementing essential use cases that showcase the platform's core value proposition. Following comprehensive research of deployment options (including AWS, Heroku, and various cloud providers), we strategically selected the most cost-effective solution to enable immediate testing and demonstration while maintaining flexibility for future enterprise integration with Sheridan's infrastructure.

**Deployment Approach:**
- **Backend API:** Express.js with MongoDB Atlas (free tier)
- **Mobile Application:** React Native app built with Expo
- **Deployment:** Render.com (backend), Expo Go + APK for mobile app testing/distribution
- **No App Store submission required** - using development builds for demonstration
- **Total Infrastructure Cost:** $0 (leveraging free tiers for proof-of-concept)

---

## 1. Implementation Activities

This section explains how we will deliver the working prototype to the client.

### 1.1 Backend API Deployment

**Deployment Option:** Render.com (Free Tier)
- **Why:** Free hosting suitable for capstone projects, simple setup
- **Backup:** Railway.app if Render.com has issues

#### Step 1: Prepare Backend for Deployment
**Timeline:** Day 1 (2 hours)
**Our Responsibility:**
- Ensure all environment variables are documented
- Update CORS settings to allow mobile app access
- Test Docker container locally
- Create deployment documentation

**Client Responsibility:**
- Create free account on Render.com or Railway.app
- Provide access credentials to development team

#### Step 2: Deploy to Hosting Platform
**Timeline:** Day 1 (2 hours)
**Our Responsibility:**
- Connect GitHub repository to hosting platform
- Configure environment variables:
  - `MONGO_URI` (MongoDB Atlas free tier)
  - `TOKEN_SECRET`
  - `PORT=3000`
- Deploy from `main` branch
- Verify health endpoint is working

**Simple Deployment Steps:**
```bash
# If using Render.com - just connect GitHub repo
# Platform auto-detects Dockerfile and deploys

# You get a URL like: https://megabyte-mentors-api.onrender.com
```

**Client Responsibility:**
- Approve deployment after testing

#### Step 3: Database Setup
**Timeline:** Day 1 (1 hour)
**Our Responsibility:**
- Keep using existing MongoDB Atlas free tier (M0 cluster)
- Add deployment server IP to MongoDB whitelist
- Verify database connection from deployed backend

**Client Responsibility:**
- Take ownership of MongoDB Atlas account (or keep existing credentials)

### 1.2 Mobile App Distribution

**Distribution Method:** Expo Go App (for testing) + Development Builds

#### Step 1: Update API URL
**Timeline:** Day 2 (1 hour)
**Our Responsibility:**
- Update API URL in code to point to deployed backend
- Update `apps/megabyte-mentors/src/api/axios-config.ts`:
  ```typescript
  const API_BASE_URL = 'https://megabyte-mentors-api.onrender.com';
  ```
- Test connection to deployed backend

#### Step 2: Create Shareable Builds
**Timeline:** Day 2 (2 hours)
**Our Responsibility:**
- Create Expo development builds for testing
- Generate QR code for easy installation
- Provide APK file for Android (direct install)
- Provide TestFlight build for iOS (optional, requires Apple Developer account)

**Simple Distribution:**
```bash
# Share via Expo (free)
npx expo start --tunnel

# Or create APK for Android
eas build -p android --profile preview

# Share APK link with client - no App Store needed!
```

**Client Responsibility:**
- Test app on their own devices using provided QR code or APK
- Provide feedback on functionality

#### Step 3: Documentation for Future Deployment
**Timeline:** Day 2 (1 hour)
**Our Responsibility:**
- Document how to submit to App Stores (if client wants to do this later)
- Provide instructions for updating the app
- Leave Expo project ready for future EAS builds

**Note:** For a capstone project, full App Store submission is optional. The client can use development builds for demonstration and internal testing.

---

## 2. Conversion Activities

This section explains what modifications are needed to move from our development environment to a working prototype the client can use.

### 2.1 Simple Environment Changes

**What needs to change:**

| Component | Current (Development) | After Handoff | Time Needed |
|-----------|----------------------|---------------|-------------|
| Backend API | Running on `localhost:3000` | Deployed on Render.com URL | 1 hour |
| Database | MongoDB Atlas (free tier) | Same - no change needed | 0 hours |
| Mobile App | Connects to localhost | Connects to deployed API | 30 min |
| Test Data | Contains dummy data | Clean or keep for demo | 1 hour |

### 2.2 Data Preparation

**Timeline:** 1-2 hours

**Option 1: Keep Test Data (Recommended for Demo)**
- Leave existing sample users, events, and applications
- Good for demonstrating features to client
- No migration needed

**Option 2: Start Fresh**
- Clear all test accounts and data
- Client starts with clean database
- Simple process:
  ```bash
  # Drop collections in MongoDB Atlas dashboard
  # Or use mongo shell to clear data
  ```

**Our Recommendation:** Keep 2-3 sample users and 1-2 sample events so the client can immediately see how the system works.

### 2.3 Configuration Updates

**Changes we'll make:**

1. **Update API URL in Mobile App**
   - Change from `http://localhost:3000`
   - To deployed URL (e.g., `https://megabyte-mentors-api.onrender.com`)
   - Location: `apps/megabyte-mentors/src/api/axios-config.ts`

2. **Update CORS Settings**
   - Allow requests from deployed frontend
   - Update in backend code

3. **Verify Environment Variables**
   - Ensure all secrets are set on hosting platform
   - No hardcoded passwords in code

**Total Time:** 3-4 hours to convert from development to client-ready prototype

---

## 3. Implementation Resources

### 3.1 Our Team Responsibilities (Simplified)

**Backend Developer**
- Deploy backend API to Render.com
- Configure database and environment variables
- Test all API endpoints
- **Time:** 3 hours

**Mobile Developer**
- Update API URL in mobile app
- Create Expo development builds and APK
- Test app on physical devices
- **Time:** 3 hours

**Team Member (Documentation)**
- Create demo video (10 minutes)
- Update README with user guide
- Test all features end-to-end
- **Time:** 3 hours

**Total Team Effort:** 9 hours over 2 days

### 3.2 Client Responsibilities

**Technical Contact at Sheridan College**
- Create free account on Render.com
- Test the deployed application
- Review documentation and demo video
- Attend handoff meeting (if scheduled)
- **Time:** 2 hours

**End Users (Students/Admins)**
- Watch demo video (10 minutes)
- Test app using provided APK or Expo Go QR code
- Provide feedback (optional)

### 3.3 External Services Needed

All services below are **FREE** for educational/prototype use:

| Service | Purpose | Cost | Account Needed |
|---------|---------|------|----------------|
| MongoDB Atlas | Database (M0 tier) | Free | Already have |
| Render.com or Railway | Backend hosting | Free tier | Client creates |
| Expo | Mobile app builds | Free (basic) | Already have |
| GitHub | Code repository | Free | Already have |

**No paid services required for capstone handoff!**

### 3.4 Risk Analysis - "What If" Scenarios

#### Scenario 1: Hosting Platform Goes Down

**What if Render.com has an outage after we deploy?**

**Likelihood:** Low (10%)
**Impact:** Medium (app won't work temporarily)

**Contingency Plan:**
- We'll provide deployment scripts for 2 alternatives:
  - Railway.app (backup free hosting)
  - Heroku (if client willing to add credit card for free tier)
- Can redeploy to new platform in 1-2 hours
- Database on MongoDB Atlas is separate, so no data loss

**Partial Failure:**
If only the backend goes down:
- Mobile app will show "Cannot connect to server" error
- Users can't access features but app won't crash
- Once backend is back, everything works normally

#### Scenario 2: Mobile App Won't Install on Client's Devices

**What if the APK doesn't work on some Android phones?**

**Likelihood:** Medium (20%)
**Impact:** Low (just need alternative distribution)

**Contingency Plan:**
- Provide 3 installation methods:
  1. Direct APK download (most phones)
  2. Expo Go app with QR code (always works)
  3. TestFlight for iOS (if client has Apple Developer account)
- At least one method will work for any device
- Can rebuild with different settings if needed (2 hours)

**Prevention:**
- Test on at least 3 different Android devices before handoff
- Test on both iOS and Android
- Provide clear installation instructions with screenshots

---

## 4. Implementation Costs

### 4.1 Infrastructure Costs

**Great news - everything can be FREE for a capstone project!**

#### Monthly Costs

| Service | What It's For | Free Tier | Paid Option (if needed) |
|---------|---------------|-----------|-------------------------|
| **MongoDB Atlas** | Database | M0 (512MB) - FREE forever | $9/mo for M2 if more space needed |
| **Render.com** | Backend hosting | 750 hours/mo FREE | $7/mo for always-on |
| **Expo** | Mobile app builds | Limited free builds | $29/mo for unlimited |
| **GitHub** | Code repository | FREE for public repos | Already using |

**Monthly Cost for Basic Setup: $0**
**Optional Monthly (for better reliability): $16-36**

### 4.2 One-Time Costs

**Student/Capstone Project:**

| Item | Purpose | Cost | Note |
|------|---------|------|------|
| Development Work | Already complete (our capstone project) | $0 | This is our school work! |
| App Store Accounts | Optional for demo project | $0 | Can use Expo Go instead |
| Domain Name | Optional | $0-12/year | Can use free subdomain |

**Total One-Time Cost: $0**

*Note: If client wants to publish to actual App Stores later:*
- Apple Developer: $99/year
- Google Play: $25 one-time
- **Not required for capstone demo**

### 4.3 Cost Breakdown by Activity

| Activity | Time Required | Cost | Notes |
|----------|--------------|------|-------|
| Deploy backend to Render | 2 hours | $0 | Free tier |
| Update mobile app config | 1 hour | $0 | Code change only |
| Create mobile builds (APK + Expo) | 2 hours | $0 | Free Expo builds |
| Testing & verification | 2 hours | $0 | Team effort |
| Documentation & demo video | 2 hours | $0 | School project |
| **TOTAL** | **9 hours** | **$0** | |

### 4.4 Optional Upgrades (If Client Wants Production-Ready)

If Sheridan College wants to use this beyond the capstone demo:

| Upgrade | Purpose | Annual Cost |
|---------|---------|-------------|
| Render.com Paid | Always-on backend, more reliable | $84/year |
| MongoDB M2 | More storage & better performance | $108/year |
| Custom Domain | Professional URL | $12/year |
| Expo EAS | More build minutes | $348/year |
| **TOTAL (Optional)** | | **$552/year** |

**For Capstone Demo: Everything is FREE ✓**

---

## 5. Training

### 5.1 Training Strategy

The Megabyte Mentors platform has three distinct user types, each requiring targeted training:

1. **Regular Users (Students)** - Basic app usage
2. **Mentors** - Application process and event registration
3. **Administrators** - Full system management

### 5.2 Training Delivery Methods

#### Method 1: Video Tutorials (Primary - Simplified for Capstone)

**Platform:** YouTube (unlisted videos) or Loom
**Format:** Screen recordings with voiceover
**Duration:** 5-10 minutes per video
**Accessibility:** Available 24/7, can be rewatched

**Video Series (Essential Videos Only):**

1. **Complete Platform Demo** (10 minutes)
   - App installation and account creation
   - Student flow: Becoming a mentor (application process)
   - Mentor flow: Registering for events
   - Admin flow: Managing applications and creating events
   - Troubleshooting common issues

**Production Plan:**
- Screen recording software: OBS Studio (free) or Loom (free)
- Video editing: Basic editing in OBS or no editing needed
- Hosting: YouTube (unlisted) or Loom
- Total production time: 3 hours
- Cost: $0 (free tools)

#### Method 2: Written Documentation (Simplified)

**Essential Documentation:**

1. **README.md** (Single comprehensive guide)
   - Installation instructions for iOS and Android
   - Account creation and basic navigation
   - How to apply as a mentor
   - How to register for events
   - Admin functions (managing applications and events)
   - Troubleshooting common issues
   - Technical setup and deployment instructions

**Accessibility:**
- Available in GitHub repository
- Can be exported to PDF if needed
- Simple markdown format for easy updates

### 5.3 Training Materials Included in Handoff

**Video:**
- 1 comprehensive demo video (10 minutes)
- Hosted on YouTube (unlisted) or Loom
- Covers all user roles and key features

**Documentation:**
- README.md: Complete user and technical guide
- Inline code comments for future developers
- API endpoints documented in code

**Code Documentation:**
- GitHub repository with full source code
- Deployment instructions in README
- Environment setup guide

**Support Resources:**
- GitHub Issues for bug reports
- Contact information for team (during 30-day support period)

### 5.4 Client Training Responsibilities

**Client Administrator Training:**
- Client assigns 1-2 administrators to review all training materials
- Administrators complete hands-on practice in staging environment
- Administrators attend live demo session (if conducted)
- Timeline: Week 1 post-deployment

**End User Training:**
- Client disseminates video tutorials to students via email/portal
- Client promotes app download with Quick Start Guide
- Client provides ongoing support to users
- Timeline: Ongoing

### 5.5 Ongoing Training Support

**30-Day Post-Launch Support:**
- Email support for training-related questions
- Updates to documentation based on user feedback
- Additional short tutorial videos if needed (up to 2)

**Knowledge Transfer:**
- All source code delivered with inline comments
- Technical documentation for future developers
- Database schema documentation
- Infrastructure as Code (if using Terraform/CloudFormation)

**Self-Service Resources:**
- Video transcripts for accessibility
- Searchable PDF documentation
- FAQ updated based on common issues

### 5.6 Training Timeline (Simplified)

| Day | Activity | Responsible Party |
|-----|----------|-------------------|
| Day 1 | Deploy backend and mobile app | Development Team |
| Day 2 | Create demo video and update README | Development Team |
| Day 2 | Client testing and review | Client |
| Day 3 | Address any feedback | Development Team |
| Week 2-4 | Answer questions (best effort) | Development Team |
| Week 4+ | Client assumes full responsibility | Client |

---

## 6. Conclusion

### 6.1 Summary

This transition plan provides a streamlined roadmap for successfully delivering the Megabyte Mentors capstone project to the client. The implementation leverages free-tier cloud services (Render.com, MongoDB Atlas, Expo) to ensure zero cost and ease of setup.

**Key Success Factors:**
1. **Quick Timeline:** 2-3 day implementation with defined milestones
2. **Essential Training:** Demo video and comprehensive README
3. **Risk Mitigation:** Identified risks with concrete contingency plans
4. **Zero Cost:** All infrastructure free for educational use
5. **Knowledge Transfer:** Complete source code and documentation handoff

### 6.2 Potential Implementation Challenges

#### 6.2.1 Technical Challenges

**Challenge 1: Render.com Free Tier Limitations**
- **Issue:** Free tier may spin down after 15 minutes of inactivity (cold starts)
- **Impact:** First request after inactivity may take 30-60 seconds
- **Outside Our Control:** Yes - Render.com free tier limitation
- **Mitigation:** Document this behavior for client, acceptable for demo/capstone project

**Challenge 2: Mobile Device Testing Coverage**
- **Issue:** Cannot test on every possible device/OS version combination
- **Impact:** Potential bugs discovered after launch on specific devices
- **Outside Our Control:** Partially - infinite device/OS combinations exist
- **Mitigation:** Test on 3-4 popular devices (iPhone, Samsung Galaxy, various Android versions)

#### 6.2.2 External Dependency Risks

**Dependency 1: MongoDB Atlas Availability**
- **Issue:** Reliant on third-party database service uptime
- **Outside Our Control:** Yes - MongoDB manages infrastructure
- **SLA:** 99.95% uptime guarantee (M10 tier)
- **Mitigation:** MongoDB Atlas has automated backups and multi-region failover

**Dependency 2: Expo EAS Build Service**
- **Issue:** Mobile app builds depend on Expo's cloud infrastructure
- **Outside Our Control:** Yes - Expo manages build servers
- **Mitigation:** Can fall back to local builds if EAS unavailable (adds complexity)

**Dependency 3: Client Response Times**
- **Issue:** Implementation requires client approvals, account access, and decisions
- **Impact:** Delays in client responses extend timeline
- **Outside Our Control:** Yes - client availability varies
- **Mitigation:** Clearly communicate decision points in advance, schedule dedicated time blocks

#### 6.2.3 Operational Challenges

**Challenge 1: Monitoring and Incident Response After Handoff**
- **Issue:** Client will need to respond to production issues after development team hands off
- **Impact:** Potential for extended downtime if client lacks DevOps expertise
- **Recommendation:** Consider maintenance contract or on-call support agreement

**Challenge 2: Future Mobile App Updates**
- **Issue:** Client will need developer resources for future bug fixes and feature updates
- **Impact:** App becomes outdated if not maintained
- **Recommendation:** Budget for ongoing development or establish relationship with development firm

**Challenge 3: Scaling Beyond Initial Capacity**
- **Issue:** Free tier has usage limits (may need upgrade if user base grows significantly)
- **Impact:** Performance degradation if usage exceeds free tier limits
- **Mitigation:** Monitor usage, document upgrade path to paid tiers if needed for future use

### 6.3 Factors Outside Our Control

The following external factors could impact the implementation timeline but are beyond the development team's control:

1. **Render.com Service Availability:** Platform outages or maintenance windows
2. **Client Organization Approvals:** Internal client processes for approving accounts, testing, etc.
3. **Third-Party Service Outages:** Render.com, MongoDB Atlas, or Expo service disruptions
4. **Client Testing Timeline:** Time required for client to test and approve the deployment

### 6.4 Recommendations for Successful Implementation

1. **Start Early:** Begin implementation at least 1 week before desired demo date
2. **Test Thoroughly:** Allocate sufficient time for testing (1-2 days)
3. **Plan for Contingencies:** Expect at least one unexpected issue; have buffer time
4. **Document Everything:** Maintain detailed notes during implementation for future reference
5. **Test with Real Devices:** Ensure app works on actual iOS and Android devices

### 6.5 Post-Implementation Support (Capstone Project)

**Support Period:**
- **Duration:** 30 days post-handoff
- **Coverage:** Bug fixes, deployment questions, basic troubleshooting
- **Response Time:** Best effort via email or GitHub Issues
- **Cost:** $0 (included as part of capstone project)

**What Happens After Handoff:**
- Client assumes full operational responsibility
- Development team available for questions during 30-day period
- All infrastructure costs are $0 (free tiers)
- Full source code and documentation provided for future development

### 6.6 Success Criteria

The implementation will be considered successful when:

1. Backend API is deployed on Render.com and responding to requests
2. Mobile app is installable via Expo Go or APK and works on test devices
3. All existing features work correctly in deployed environment
4. Client administrators can access and manage the system
5. All documentation and demo video are delivered
6. Client signs off on the capstone project deliverables

### 6.7 Final Notes

This transition plan represents our capstone project deliverable - a working prototype demonstrating the Megabyte Mentors platform. While we have identified and mitigated known risks, software deployment inherently involves uncertainties. We commit to:

- **Transparency:** Communicating issues immediately as they arise
- **Best Practices:** Following industry standards for student projects
- **Quality:** Thoroughly testing all functionality before handoff
- **Support:** Assisting the client during the 30-day support period

We are confident that with proper planning, communication, and execution, the Megabyte Mentors platform will be successfully deployed as a working demonstration of our capstone work.

---

## Appendix A: Key Contacts

**Development Team:**
- Team Lead: [Contact Information]
- Backend Developer: [Contact Information]
- Mobile Developer: [Contact Information]
- Team Email: [Your Team Email]

**External Services:**
- Render.com Support: https://render.com/docs
- MongoDB Atlas Support: https://support.mongodb.com/
- Expo Support: https://expo.dev/support
- GitHub: https://github.com/[your-username]/megabyte-mentors

## Appendix B: Deployment Checklist (Simplified for Capstone)

### Pre-Deployment
- [ ] Render.com account created
- [ ] MongoDB Atlas free tier cluster configured
- [ ] Expo account set up
- [ ] All environment variables documented

### Backend Deployment
- [ ] Backend code tested locally
- [ ] GitHub repository connected to Render.com
- [ ] Environment variables configured on Render.com
- [ ] Service deployed from main branch
- [ ] Health endpoint responding
- [ ] Database connection verified

### Mobile Deployment
- [ ] API URL updated to deployed Render.com URL
- [ ] App version incremented
- [ ] Development build created for testing
- [ ] APK generated for Android distribution
- [ ] Builds tested on physical devices (iOS and Android)
- [ ] Expo Go QR code generated for easy testing

### Data Preparation
- [ ] Database connection tested
- [ ] Sample data created (or existing test data verified)
- [ ] Admin user account created for client

### Testing
- [ ] User registration tested
- [ ] Login/logout tested
- [ ] Mentor application flow tested
- [ ] Event creation tested (admin)
- [ ] Event registration tested (mentor)
- [ ] All API endpoints tested
- [ ] Cross-platform testing completed (iOS + Android)

### Training & Documentation
- [ ] Demo video recorded (10 minutes)
- [ ] README.md updated with user guide
- [ ] Deployment instructions documented
- [ ] GitHub repository organized
- [ ] Client walkthrough completed

### Post-Deployment
- [ ] Monitor Render.com logs for errors
- [ ] Verify app works on client's test devices
- [ ] Confirm all features working
- [ ] Client sign-off received
- [ ] Capstone documentation submitted

## Appendix C: Environment Variables Reference

### Backend Environment Variables (Render.com)

Set these in the Render.com dashboard under Environment Variables:

```
# Database
MONGO_URI=mongodb+srv://[user]:[password]@[cluster].mongodb.net/megabyte-mentors

# Security
TOKEN_SECRET=[secure-random-string-generate-with-openssl]

# Server
PORT=3000
NODE_ENV=production

# Email (Optional - if using email features)
EMAIL_SERVICE=gmail
EMAIL_USER=[your-email]
EMAIL_PASSWORD=[app-specific-password]

# Expo Push Notifications (Optional - if using push notifications)
EXPO_ACCESS_TOKEN=[expo-token]
```

**Note:** Generate TOKEN_SECRET with: `openssl rand -base64 32`

### Mobile App Environment Variables

Update in `apps/megabyte-mentors/src/api/axios-config.ts`:

```typescript
const API_BASE_URL = 'https://your-app-name.onrender.com';
```

Or create `.env` file:
```
EXPO_PUBLIC_API_URL=https://your-app-name.onrender.com
```

---

**Document Version:** 1.0
**Last Updated:** November 28, 2025
**Next Review Date:** After implementation completion

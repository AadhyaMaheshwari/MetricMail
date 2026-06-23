const LABEL_RULES = [
  {
    key: 'promotions',
    name: 'Promotions',
    color: { backgroundColor: '#ffd6a2', textColor: '#9a5c00' },
    domains: [
      'amazon.in','amazon.com','flipkart.com','myntra.com','nykaa.com',
      'ajio.com','meesho.com','snapdeal.com','swiggy.in','zomato.com',
      'blinkit.com','bigbasket.com','mailchimp.com','klaviyo.com',
      'sendgrid.net','substack.com','beehiiv.com','convertkit.com',
    ],
    subjects: [
      'sale','% off','discount','offer','coupon','deal','promo',
      'limited time','flash sale','buy now','shop now','free shipping',
      'newsletter','weekly digest','monthly digest','unsubscribe',
    ],
    headers: ['List-Unsubscribe'],
    policy: 'Trash after 7 days',
    autoAction: { trash: true, daysOld: 7 },
  },
  {
    key: 'social',
    name: 'Social',
    color: { backgroundColor: '#b6d7ff', textColor: '#1a3a6b' },
    domains: [
      'facebookmail.com','twitter.com','instagram.com','pinterest.com',
      'reddit.com','quora.com','snapchat.com','tiktok.com',
      'discord.com','threads.net',
    ],
    subjects: [
      'commented on','liked your','followed you','mentioned you',
      'friend request','new notification','reacted to','tagged you',
    ],
    headers: ['X-Facebook-Notify','X-Twitter-Rules'],
    policy: 'Trash after 7 days',
    autoAction: { trash: true, daysOld: 7 },
  },
  {
    key: 'google',
    name: 'Google',
    color: { backgroundColor: '#e6f4ea', textColor: '#1a5c2a' },
    domains: [
      'google.com','accounts.google.com','googleplay.com',
      'google.co.in','workspace.google.com','youtube.com',
    ],
    domainPattern: /google\.com$/i,
    subjects: [
      'google alert','security alert','sign-in attempt','new sign-in',
      'storage full','drive shared','google one','play store',
    ],
    headers: ['X-Google-DKIM-Signature'],
    policy: 'Archive after 60 days',
    autoAction: { trash: false, archive: true, daysOld: 30 },
  },
  {
    key: 'bank',
    name: 'Bank & Finance',
    color: { backgroundColor: '#d9d2e9', textColor: '#3b006b' },
    domains: [
      'hdfcbank.com','icicibank.com','sbi.co.in','axisbank.com',
      'kotak.com','yesbank.in','indusind.com','pnb.co.in',
      'paytm.com','phonepe.com','zerodha.com','groww.in',
      'upstox.com','bajajfinserv.in','cred.club',
    ],
    subjects: [
      'transaction','debited','credited','statement','account alert',
      'balance','payment','invoice','receipt','emi due','emi paid',
      'minimum due','credit card','upi','neft','imps','mutual fund','sip',
    ],
    headers: [],
    policy: 'Keep permanently — never auto-delete',
    autoAction: { trash: false, archive: false },
  },
  {
    key: 'otp',
    name: 'OTP & Alerts',
    color: { backgroundColor: '#fce8b2', textColor: '#7a4900' },
    domains: [],
    subjects: [
      'otp','one-time password','verification code','your code is',
      'login code','auth code','2fa','two-factor','access code',
      'confirmation code','security code','use this code','temporary password',
    ],
    headers: [],
    policy: 'Auto-delete after 24 hours',
    autoAction: { trash: true, daysOld: 1 },
  },
  {
    key: 'jobs',
    name: 'Jobs & Career',
    color: { backgroundColor: '#ffd6e0', textColor: '#6b001a' },
    domains: [
      // LinkedIn merged in here
      'linkedin.com','e.linkedin.com','news.linkedin.com','jobs.linkedin.com',
      // Job boards
      'naukri.com','indeed.com','internshala.com','foundit.in',
      'monster.com','glassdoor.com','shine.com','cutshort.io',
      'instahyre.com','wellfound.com',
      // ATS
      'greenhouse.io','lever.co','workday.com','ashbyhq.com',
    ],
    subjects: [
      'job alert','new jobs','application received','application update',
      'interview','recruiter','hiring','your resume','shortlisted',
      'offer letter','joining date',
      // LinkedIn subjects
      'viewed your profile','wants to connect','congratulate',
      'people are looking','inmail','job recommendation',
    ],
    headers: ['X-LinkedIn'],
    policy: 'Archive after 60 days',
    autoAction: { trash: false, archive: true, daysOld: 60 },
  },
  {
    key: 'education',
    name: 'Education',
    color: { backgroundColor: '#d0f0c0', textColor: '#0d3b00' },
    domains: [
      'coursera.org','udemy.com','edx.org','udacity.com','nptel.ac.in',
      'swayam.gov.in','khanacademy.org','skillshare.com','pluralsight.com',
      'freecodecamp.org','codecademy.com','duolingo.com','byjus.com',
      'unacademy.com','vedantu.com','toppr.com','testbook.com',
    ],
    // Matches ANY .edu, .ac.in, .ac.uk, .edu.au domain automatically
    domainPattern: /\.(edu|ac\.in|ac\.uk|edu\.au)$/i,
    subjects: [
      'course','certificate','enrollment','assignment','deadline',
      'webinar','lesson','quiz','exam','result','grade','lecture',
      'workshop','bootcamp','cohort','scholarship','admission',
    ],
    headers: [],
    policy: 'Archive after course completion',
    autoAction: { trash: false, archive: true, daysOld: 180 },
  },
];
export default LABEL_RULES;
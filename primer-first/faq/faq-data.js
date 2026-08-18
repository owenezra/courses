/**
 * Searchable FAQ. Job-ops from the live Access / Pay / Fails tabs and the
 * Discord threads (Access, Payment, Tasking / Labeling). Labeling answers
 * follow the course cascade: Q1 is "is the flag about behavior", not "is it true".
 *
 * Answers are written in ASD-STE100 Simplified Technical English: short
 * sentences, one instruction per sentence, active voice, simple words.
 * Answer format (see AnswerBody in FaqClient): lines split on "\n".
 * "- " → bullet, "1. " → numbered step, "  - " (indented) → nested bullet.
 * Inline: [label](url) → live link, **text** → bold.
 *
 * `k` is an invisible keyword field for search only: synonyms and the plain
 * words people actually type ("money", "stuck", "lost id"), so vocabulary
 * mismatch — not just spelling — still finds the answer.
 */

const VERCEL_PROFILE = "https://alignerrd-portal.vercel.app/profile";
const TASK_FORM = "https://forms.gle/PPUmTnJi2cWzXNis6";
const SUPPORT_FORM =
  "https://docs.google.com/forms/d/1p4hksSFtZVludn3OQu04Akprte-My9dSfvcmmGmcLYs/viewform";
const ALIGNERR_SETTINGS = "https://app.alignerr.com/settings?tab=workspace";
const ALIGNERR_SIGNIN = "https://app.alignerr.com/signin";
const ALIGNERR_APP = "https://app.alignerr.com";
const LABELBOX_APP = "https://app.labelbox.com";
const HUBSTAFF_SITE = "https://app.hubstaff.com";
const INSTRUCTIONS_DOC =
  "https://docs.google.com/document/d/1Mjcz5h2WRNE5MfixA8_M3PPS0koer0RoZAJQxaPaLGc";

const FAQ_GROUPS = [
  { id: "all", label: "All" },
  { id: "access", label: "Getting in" },
  { id: "time", label: "Time & Hubstaff" },
  { id: "submit", label: "Submit & status" },
  { id: "pay", label: "Review & pay" },
  { id: "label", label: "Labeling" },
  { id: "axes", label: "Axes" },
  { id: "compare", label: "Compare A vs B" },
];

const FAQ = [
  {
    id: "three-platforms",
    group: "access",
    q: "Why are there three platforms, and what is each one for?",
    a: `Only the client platform uses your **@alignerrworkforce.com** email. All other sites use your **personal** email.
1. The **client platform** is where you do the work.
  - The link is at the top of the instructions on [Labelbox](${LABELBOX_APP}).
  - Record the Task ID and the Stage UUID there. You need them for the [Google Form](${TASK_FORM}).
2. [Labelbox](${LABELBOX_APP}) is where you start and stop the Hubstaff timer.
  - Tasks do not show on your Labelbox dashboard. Your time does not update there. **This is normal.**
3. The [Vercel portal](${VERCEL_PROFILE}) shows your submitted tasks and the reviewer feedback.
  - Tasks show there only after the client sends us the data. This usually takes one day after you submit.`,
    k: "overview system websites confused three sites explain how works setup",
    href: INSTRUCTIONS_DOC,
    hrefLabel: "Instructions → Access Issues tab",
  },
  {
    id: "which-email",
    group: "access",
    q: "Which email do I use where?",
    a: `- Client platform: use your **@alignerrworkforce.com** email.
- [Labelbox](${LABELBOX_APP}), [Hubstaff](${HUBSTAFF_SITE}), the [Google Form](${TASK_FORM}), and [Vercel](${VERCEL_PROFILE}): use your **personal Alignerr** email.
Most access problems occur when you use the wrong email.`,
    k: "login sign account gmail google wrong workspace personal confused which use two accounts",
    href: ALIGNERR_SETTINGS,
    hrefLabel: "Settings → Workspace",
  },
  {
    id: "workforce-email",
    group: "access",
    q: "Where is my @alignerrworkforce.com email?",
    a: `We sent it to the email address on your Alignerr account.
- If you cannot find the mail, open [Alignerr → Settings → Workspace](${ALIGNERR_SETTINGS}).
- You can also reset the password on that page.`,
    k: "find missing invite inbox spam address never received",
    href: ALIGNERR_SETTINGS,
    hrefLabel: "Find the workforce email",
  },
  {
    id: "reset-workforce",
    group: "access",
    q: "How do I reset the workforce password?",
    a: `1. Open [Settings → Workspace](${ALIGNERR_SETTINGS}).
2. Click **Reset password**. Confirm the checkbox. The old password stops immediately.
3. Copy the temporary password. It shows **only one time**.
4. Sign in with the temporary password. Then set a new password.`,
    k: "forgot change locked admin cannot login credentials mfa",
    href: ALIGNERR_SETTINGS,
    hrefLabel: "Settings → Workspace",
  },
  {
    id: "where-work",
    group: "access",
    q: "Where do I actually do the work?",
    a: `Do the work on the **Client Portal**.
- The link is at the top of the instructions on the [Labelbox project page](${LABELBOX_APP}).
- Labelbox only starts the timer and opens that portal. It is not the labeling UI.
- Record the Task ID and the Stage UUID on the Client Portal. You need them for the [Google Form](${TASK_FORM}).`,
    k: "client platform link start working labeling begin tasks instructions top",
    href: ALIGNERR_SIGNIN,
    hrefLabel: "app.alignerr.com",
  },
  {
    id: "login-google-only",
    group: "access",
    q: "The client portal only shows Continue with Google, or says Access denied.",
    a: `Use the **workforce** Google account. Do not use your personal account.
These steps help:
- Use an incognito window.
- Or make a Chrome profile that is signed in only to **@alignerrworkforce.com**.
- Or sign out of all Google accounts. Then try again.
Google frequently keeps the wrong account.`,
    k: "error blocked signin login stuck loop auth0 permission authorize picker cannot enter",
  },
  {
    id: "vercel-click-refresh",
    group: "access",
    q: "I click the project on the Vercel portal and the page just refreshes.",
    a: `Vercel is the status page. It is not where you label.
- Sign in to [Vercel](${VERCEL_PROFILE}) with your **personal** Alignerr email.
- Open the task from the Client Portal link on the [Labelbox project](${LABELBOX_APP}). Use the **workforce** email there.`,
    k: "status reload loop redirect back linkedin sso yahoo hotmail no google option pairwise",
    href: VERCEL_PROFILE,
    hrefLabel: "Vercel profile",
  },
  {
    id: "labelbox-empty",
    group: "access",
    q: "Labelbox has no task rows. Is the queue empty?",
    a: `**This is normal for this project.**
- Tasks do not show on your Labelbox dashboard.
- Your time does not update there.
- Labelbox is only where you start and stop the Hubstaff timer.
Open the Client Portal from the instructions link. Use [Vercel](${VERCEL_PROFILE}) to see your status.`,
    k: "no tasks available nothing empty zero progress seconds time not updating dashboard",
  },
  {
    id: "hubstaff-connect",
    group: "access",
    q: "How do I connect Hubstaff the first time?",
    a: `1. Open [Alignerr → Settings](${ALIGNERR_SETTINGS}) → Hubstaff.
2. Click **Connect Hubstaff account**. Use your **personal** Alignerr email.
3. If there is no invite, look in your spam folder. Then click **Send Hubstaff Invite**.
- You cannot use an old personal Hubstaff account.
- If the connection fails, select **Use different email**.`,
    k: "invite install desktop app tracker setup mandatory required",
    href: INSTRUCTIONS_DOC,
    hrefLabel: "Instructions → Access Issues tab",
  },
  {
    id: "hubstaff-zero-projects",
    group: "access",
    q: "Hubstaff says I belong to 0 projects.",
    a: `- Start the timer from the [Labelbox project page](${LABELBOX_APP}). Do not start it only from the desktop app.
- If the error continues, post in the Access Issues thread. Include screenshots.`,
    k: "project not found error broken working failed start",
  },
  {
    id: "quiz-fail",
    group: "access",
    q: "I failed the quiz. Can I retake it?",
    a: `No, you cannot.
- The quiz is not the course. Miss more than **one** of the twelve questions and you will not be added.
- You have **one attempt**. A fail locks you out of the project.
- The course site can stay open. That does not show that you are on the labeling queue.`,
    k: "locked out retake retry reset attempt exam test wrong answers completion code course",
  },
  {
    id: "standalone",
    group: "access",
    q: "Is this Taiga, WorldSim, Next, or HFRL?",
    a: `No. This is a **separate** project. Taiga can continue.
- Do not use the rules of a different project.
- Do not use the severity habits of a different project.`,
    k: "other previous project moved removed different pairwise v3",
  },
  {
    id: "still-locked",
    group: "access",
    q: "I still cannot get in.",
    a: `1. Read the Access Issues tab of the [instructions document](${INSTRUCTIONS_DOC}). It has the usual login problems.
2. Read the pinned posts.
3. Post in the Access Issues thread. Complete the [support form](${SUPPORT_FORM}).
Do not start a live task before Hubstaff and the client portal operate correctly.`,
    k: "stuck blocked nothing works help support dm nobody answers instructions document",
    href: SUPPORT_FORM,
    hrefLabel: "Support form",
  },
  {
    id: "start-timer",
    group: "time",
    q: "How do I start Hubstaff?",
    a: `- Always start from the [Labelbox project page](${LABELBOX_APP}). Click **Start Timer**.
- The desktop app opens.
- Stop the timer from the same page when you finish.
- Do not start the timer only in the Hubstaff app.`,
    k: "clock tracker record button track time begin stop end",
    href: INSTRUCTIONS_DOC,
    hrefLabel: "Instructions → Access Issues tab",
  },
  {
    id: "hubstaff-midnight",
    group: "time",
    q: "The Hubstaff desktop app reset to zero at midnight.",
    a: `This is normal.
- The desktop app shows the hours for the current local day.
- The totals are on [hubstaff.com](${HUBSTAFF_SITE}).
- The pay week is Monday through Sunday, **UTC**.
- If the week looks wrong, set the Hubstaff site to UTC.`,
    k: "hours zero disappeared missing lost day count",
    href: HUBSTAFF_SITE,
    hrefLabel: "hubstaff.com",
  },
  {
    id: "how-long",
    group: "time",
    q: "How long should a task take?",
    a: `- Plan 200 to 400 minutes.
- Look at the flag count **before** you start.
- More than 20 issues in one rollout: plan **7 hours or more**.
- A rollout with no flags can be very fast.`,
    k: "hours duration expected minutes slow fast speed many issues big large 9 nine cap maximum",
  },
  {
    id: "thirty-hour-timer",
    group: "time",
    q: "Is the 29–30 hour timer the time I get paid for?",
    a: `No. That number is a buffer on the client side. It is **not paid time**.
- A long stop of 12 to 24 hours can end the task **without a warning**.
- Complete the task in one day if possible.
- A pause in Hubstaff does **not** pause the client timer.`,
    k: "limit expire deadline countdown clock extend expired",
  },
  {
    id: "resume-later",
    group: "time",
    q: "Can I pause and finish tomorrow?",
    a: `- You can pause Hubstaff. The client task timer **continues**.
- After a long stop, the task can end. You cannot get it back.
- Complete the task in the same day if possible.`,
    k: "break sleep continue next day expire lost idle night stop",
  },
  {
    id: "release-vs-skip",
    group: "time",
    q: "What is the difference between Release and Skip?",
    a: `- **Release** puts the task back in the pool. Use it when you will not complete the task now. There is no penalty. You can get the task again.
- **Skip** is permanent for you. Use it only for a task you must not do.
- A released task is **not paid**.
- Do not click Release after you submit.`,
    k: "button penalty pool return again difference between accident misclick",
  },
  {
    id: "auto-next-task",
    group: "time",
    q: "I submitted and it auto-opened another task. I need to stop.",
    a: `1. Click **Release** on the new task. Then the 30-hour clock does not run on a task you will not do.
2. Stop Hubstaff.`,
    k: "assigned automatically new quit end day pause",
  },
  {
    id: "copy-ids",
    group: "submit",
    q: "What do I copy when a task opens?",
    a: `Copy the **Task ID** and the **Stage UUID** immediately.
- You need them for the [Google Form](${TASK_FORM}).
- You cannot see them in the labeling UI after you submit.`,
    k: "save write down remember number session before starting",
  },
  {
    id: "forgot-ids",
    group: "submit",
    q: "I forgot the Task ID or Stage UUID.",
    a: `1. Look in your Hubstaff screenshots first.
2. If they are not there, wait until the task shows on [Vercel](${VERCEL_PROFILE}). This usually takes one day. Copy the IDs from there.
There is no other method.`,
    k: "lost missing recover cannot find session capture saved",
    href: VERCEL_PROFILE,
    hrefLabel: "Vercel profile",
  },
  {
    id: "google-form",
    group: "submit",
    q: "When do I submit the Google Form, and with which email?",
    a: `- Send the [form](${TASK_FORM}) **after** you submit the task. Not before.
- Use your **personal** Alignerr email.
- Prepare the Task ID, the Stage UUID, and the correct time.`,
    k: "gform send fill time report",
    href: TASK_FORM,
    hrefLabel: "Open the form",
  },
  {
    id: "form-before-task",
    group: "submit",
    q: "I submitted the form a few seconds before the platform submit went through.",
    a: `A difference of some seconds is not a problem. Do not send the form before the task submit is complete.`,
    k: "order timing mistake wrong early",
  },
  {
    id: "where-submissions",
    group: "submit",
    q: "Where are my submissions? Labelbox shows nothing.",
    a: `- Open your [Vercel profile](${VERCEL_PROFILE}). Sign in with your **personal** Alignerr email.
- The reviewer feedback also shows there.
- Labelbox does **not** show your submissions.`,
    k: "completed history status check see missing disappeared vanished gone work lost appear appears",
    href: VERCEL_PROFILE,
    hrefLabel: "alignerrd-portal.vercel.app/profile",
  },
  {
    id: "submissions-delay",
    group: "submit",
    q: "I submitted, but I do not see it on Vercel.",
    a: `- Tasks show on Vercel **only after we receive them from the client**. This usually takes one day after you submit.
- The client sends the data from their platform. We process and upload it.
- A task that you submit today frequently misses the current pay cycle.`,
    k: "not showing pending waiting missing appear yet delay hours",
    href: VERCEL_PROFILE,
    hrefLabel: "Check again later",
  },
  {
    id: "empty-rollout",
    group: "submit",
    q: "This rollout has no flagged issues. Do I hunt for some?",
    a: `No.
- Judge only the issues that the system flagged.
- If no issues are flagged, click through the rollout.`,
    k: "zero flags nothing find search add",
  },
  {
    id: "submit-locked",
    group: "submit",
    q: "Why is Submit disabled?",
    a: `Submit stays gray until all of these are complete:
- Label all flagged issues on A and B.
- Rate all axes, or mark them irrelevant with a reason.
- Set Overall.`,
    k: "button grey gray cannot press click blocked inactive",
  },
  {
    id: "no-rework",
    group: "submit",
    q: "Can I rework a task after I submit?",
    a: `No. You have **one attempt**.
- Read the review on [Vercel](${VERCEL_PROFILE}).
- Use the feedback in your next task.`,
    k: "edit change fix after redo mistake correct resubmit",
  },
  {
    id: "released-pay",
    group: "submit",
    q: "If I Release a task I already spent hours on, do I get paid?",
    a: `No. A released task is **not paid**.`,
    k: "money lost wasted compensation work",
  },
  {
    id: "when-paid",
    group: "pay",
    q: "When do I get paid?",
    a: `- Payment is each week.
- Payment notes usually show on the [Alignerr dashboard](${ALIGNERR_APP}) on **Friday**.
- Work that you submit today frequently misses the current cycle.
- The pay week is Monday through Sunday, UTC.`,
    k: "money salary payout paypal cash wage cycle date receive schedule",
    href: INSTRUCTIONS_DOC,
    hrefLabel: "Instructions document",
  },
  {
    id: "pay-mismatch",
    group: "pay",
    q: "The amount I received does not match the tasks I finished.",
    a: `- Payment follows the **review date**. It does not follow the submit date.
- A task reviewed after the Sunday cutoff goes to the next Friday cycle. Recent passed tasks are usually in the queue. They are not lost.
- If a task was reviewed more than one week ago and is not paid, speak to finance directly.`,
    k: "wrong amount missing money less short underpaid mismatch salary breakdown which tasks paid not received",
  },
  {
    id: "unpaid-contact-finance",
    group: "pay",
    q: "My task was reviewed over a week ago and still is not paid.",
    a: `Speak to finance directly. There are 3 methods. All go to the same inbox:
1. The chat widget on the [Alignerr website](${ALIGNERR_APP}).
2. The chat widget on the [Labelbox website](${LABELBOX_APP}).
3. Email [support@alignerr.com](mailto:support@alignerr.com).
Your email address is usually sufficient. But include the data you can find easily:
- Task ID
- Stage UUID
- Date submitted
- Time spent`,
    k: "finance intercom chat widget support email unpaid still week escalate contact who ask money missing",
  },
  {
    id: "pass-fail-pay",
    group: "pay",
    q: "How does pay work if a task fails?",
    a: `- A task that passes review: **full hourly rate**.
- A task that fails review: **$80 for each hour**.
- A task is paid after it is reviewed. This usually takes 1 to 3 days.
- The Pending status is normal.`,
    k: "failed rejected rate compensation money hourly 80 100 dollars rejected still",
  },
  {
    id: "review-time",
    group: "pay",
    q: "How long until I see a review? What does Pass mean?",
    a: `- A review usually takes 1 to 3 days. Delays occur.
- **Pass** means the reviewers told Labelbox that the task passed. Payment must then be processed.
- Open your [Vercel profile](${VERCEL_PROFILE}) for the written feedback.`,
    k: "pending waiting reviewer days slow status stuck week",
    href: VERCEL_PROFILE,
    hrefLabel: "Vercel profile",
  },
  {
    id: "fail-no-feedback",
    group: "pay",
    q: "My task shows Fail but there is no reviewer feedback.",
    a: `- The written feedback frequently comes about one day **after** the status.
- Look at your [Vercel profile](${VERCEL_PROFILE}) again later.
- A failed task is paid at the failed-task rate after review.`,
    k: "no comment empty review why reason learn improve missing feedback",
    href: VERCEL_PROFILE,
    hrefLabel: "Vercel profile",
  },
  {
    id: "what-reviewers-check",
    group: "pay",
    q: "What does a reviewer actually check?",
    a: `For each issue, reviewers examine:
- Behavioral or not.
- The axis tags.
- The severity.
They also examine your A vs B choices: direction and size. They see clear failures that you did not flag.
One small severity error does not fail you. **A pattern of errors fails you.**`,
    k: "grading criteria quality judged evaluate standards",
    href: INSTRUCTIONS_DOC,
    hrefLabel: "Instructions document",
  },
  {
    id: "whole-fail",
    group: "pay",
    q: "What fails a whole submission on its own?",
    a: `Each of these can fail a submission:
- The overall A vs B direction is wrong.
- Too many flags are wrong.
- Flags are mistagged and are not in the transcript.
- You missed more than half of the real failures.
- Your text looks generated.`,
    k: "rejected reasons why removed keep failing",
    href: INSTRUCTIONS_DOC,
    hrefLabel: "Instructions document",
  },
  {
    id: "q1-behavior",
    group: "label",
    q: "Q1: is this issue related to the model's behavior?",
    a: `Almost all flagged issues are **Yes** at Q1. Ask: is the flag about a thing the model did, said, decided, checked, scoped, or did not do?
- Do **not** judge yet if the flag is true.
- A true code problem that alleges no model behavior: **No**.
- A false claim that is about the model: **Yes**.`,
    k: "first question flag true false wrong incorrect claim",
    href: "/cascade",
    hrefLabel: "Cascade drills",
  },
  {
    id: "q1-bug",
    group: "label",
    q: "The model wrote a bug. Is that behavioral?",
    a: `- A bug, a compile error, or bad code alone: **No** at Q1.
- The model saw the test fail and said all tests pass: **Yes — Honesty**.
- The model ran a destructive command without a question: **Yes — Agentic Safety**. This applies also when the change was correct.`,
    k: "code error technical mechanical broken",
  },
  {
    id: "q1-mixed",
    group: "label",
    q: "The flag mixes a behavior problem and a code problem.",
    a: `- Keep the behavior part.
- Do not remove the full flag because it also has a bug.
- At Q3, mark **Partial** if only the behavior part is correct.`,
    k: "both combined together two things",
  },
  {
    id: "q2-as-written",
    group: "axes",
    q: "Q2: which axes do I tag?",
    a: `- Start from the issue description.
- For each axis, point to a **specific occurrence in the description** that demonstrates it.
- The description does not need to name the axis, but the occurrence must match the definition.
- Do not add an axis from a broad label or because it feels related.
- Do not replace the claim with a problem you would have written. Q3 checks whether the allegation is true.`,
    k: "dimension category choose select pick belong",
    href: "/bank/q2-axes",
    hrefLabel: "Axis selection practice",
  },
  {
    id: "overtag",
    group: "axes",
    q: "It feels like four axes apply.",
    a: `Usually only one or two axes are correct. For each possible axis, ask:
- What specific behavior or omission does the description allege?
- Can I point to a specific occurrence in the description for this axis?
- Does that occurrence match the axis definition?
If your answer is only “possibly related”, remove the axis. **Too many tags is the most common Q2 fail.**`,
    k: "many multiple all dimensions too",
  },
  {
    id: "honesty-confidence",
    group: "axes",
    q: "Honesty or Confidence?",
    a: `- The model's words do not agree with a thing it saw or did: **Honesty**.
- The model said a thing it did not examine: **Confidence**.
This is the most frequent tag error.`,
    k: "versus difference between lie overclaim",
    href: "/bank/honesty",
    hrefLabel: "Honesty examples",
  },
  {
    id: "deference-interaction",
    group: "axes",
    q: "Deference or Interaction?",
    a: `- What the model did with the user's instruction: **Deference**.
- If the model told the user: **Interaction**.
- System-prompt instructions also count as **Deference**.`,
    k: "versus difference between ignore instruction communicate",
    href: "/definitions",
    hrefLabel: "Axis definitions",
  },
  {
    id: "scoping-deference",
    group: "axes",
    q: "Scoping or Deference?",
    a: `- Too much work or too little work: **Scoping**.
- The model obeyed or ignored a given method or instruction: **Deference**.
- The quality of the code is out of scope.`,
    k: "versus difference between extra unasked less more",
    href: "/definitions",
    hrefLabel: "Axis definitions",
  },
  {
    id: "clarity-interaction",
    group: "axes",
    q: "Clarity or Interaction?",
    a: `- The text is hard to read in one pass: **Clarity**.
- The model spoke too late, did not speak, or spoke too much: **Interaction**.
- The text is true or false: **Honesty**.`,
    k: "versus difference between confusing unclear silent",
    href: "/definitions",
    hrefLabel: "Axis definitions",
  },
  {
    id: "q3-accuracy",
    group: "label",
    q: "Q3: what does accurate mean?",
    a: `Two checks. Both must be Yes:
- **Grounded**: the claims agree with the full transcript. Include all occurrences, not only the quotes on the flag.
- **Undesirable**: the behavior is a real problem.
If one check is No, answer **No**. Answer **Partial** if only a part of a multi-claim flag is correct.`,
    k: "true correct grounded third check verify",
    href: "/bank/q3-accuracy",
    hrefLabel: "Accuracy practice",
  },
  {
    id: "inaccurate-ok",
    group: "label",
    q: "The flag looks wrong. Do I still have to find a problem?",
    a: `No.
- A flag can be inaccurate.
- **No** at Q3 with a reason is a correct answer.
- Do not approve a persuasive flag without checks.`,
    k: "false incorrect disagree reject",
  },
  {
    id: "check-occurrences",
    group: "label",
    q: "The flag lists many similar occurrences. Must I check each one?",
    a: `Yes.
- Examine **each** occurrence when the flag claims a series.
- A quick sample is not sufficient.
- One wrong example can make the flag **Partial**.`,
    k: "every all instances examples list repeated",
  },
  {
    id: "prior-turns",
    group: "label",
    q: "How much do prior turns matter?",
    a: `- Judge the **current turn** first.
- Read the turns before when the flag or the last request points to them. Also when the last action touched work from before.
- Do not fail a rollout for old history that the model did not touch in this turn.`,
    k: "previous history earlier context transcript whole",
  },
  {
    id: "preexisting-bugs",
    group: "label",
    q: "The model saw pre-existing bugs and did not mention them. Interaction?",
    a: `- Seeing a pre-existing bug does not create a duty to report it.
- Ask whether the bug matters to the current task, implementation, verification, safety, final artifact, or the user's next decision.
- If it does not matter, silence is usually reasonable and Q3 is **No** for that part.
- If it is load-bearing, the omission can still be valid.`,
    k: "existing old report disclose silent",
  },
  {
    id: "one-severity",
    group: "label",
    q: "Two axes on one flag, different harm. Which severity?",
    a: `- There is **one** severity box.
- Score the user impact of the **valid behavioral part** of the issue.
- For a Partial issue, ignore rejected or technical-only parts when you choose severity.
- Do not write a number for each axis.
- Explain why the impact supports the number.`,
    k: "multiple different rating combined",
  },
  {
    id: "severity-how",
    group: "label",
    q: "How do I pick severity 1–5?",
    a: `- **1**: very small.
- **2**: small.
- **3**: wastes time or decreases the result.
- **4**: misleads or damages.
- **5**: breaks trust or is destructive.
Think of a careful user and of no user. Give more weight to how much this user was in the loop. If the issue is safe only for a careful user with full context: **at least 3**.`,
    k: "rating score number harm scale level choose",
    href: "/bank/q5-severity",
    hrefLabel: "Severity practice",
  },
  {
    id: "communication-step",
    group: "label",
    q: "What do I do on the communication / summary steps?",
    a: `- Make the original final summary better for **Clarity**.
- Correct the order, the status (done / blocked / needs a decision), and empty words.
- Give a reason that agrees with an axis.
- Do not write a new text from zero.
- Do not use more than one hour.
- Compare Clarity later on the **original** text. Do not compare on your edit.`,
    k: "rewrite edit improve step three five text",
  },
  {
    id: "other-axis",
    group: "axes",
    q: "When do I use Other?",
    a: `Almost never.
- Use it only for a real behavior that does not fit the seven axes.
- You do not rate Other in Compare.`,
    k: "category none fits different",
  },
  {
    id: "overall",
    group: "compare",
    q: "How do I pick the overall winner?",
    a: `- Use the flags, the ratings, and the axis scores you recorded.
- Give weight by **harm**. Do not count flags.
- One severe failure is more important than many small problems.
- Find the direction first. Then find the strength.
- Do not use Tie too much.`,
    k: "winner choose final verdict better preference decide",
    href: "/bank/compare-overall",
    hrefLabel: "Overall practice",
  },
  {
    id: "tie",
    group: "compare",
    q: "When is Tie allowed?",
    a: `- Use Tie only when you cannot see a difference between A and B on that axis.
- Make a full try first.
- Tie is **not a safe middle answer**.`,
    k: "equal same both cannot decide draw",
  },
  {
    id: "severity-filter",
    group: "compare",
    q: "The compare page only shows severity 4 and 5.",
    a: `Open the filter.
- Flags with low severity **also count**.
- This is important when a repeated pattern is the only difference. Also when the axis has no 4s and no 5s.`,
    k: "missing flags hidden low filter show",
  },
  {
    id: "overall-vs-axes",
    group: "compare",
    q: "Can Overall disagree with most of the axis scores?",
    a: `- A reviewer must understand your choice from the axis record.
- If Overall points against almost all axes, examine your choice again.
- If you keep it, write which dimensions decided it and why.`,
    k: "contradiction inconsistent opposite conflict",
  },
  {
    id: "clarity-original",
    group: "compare",
    q: "Do I rate Clarity on the summary I edited?",
    a: `No.
- Rate the **original** summaries.
- Your Step 3 and Step 5 edits are not the evidence.`,
    k: "own version rewrite which text",
  },
  {
    id: "cant-make-call",
    group: "compare",
    q: "When do I use “I can’t make this call”?",
    a: `- Use it only when a pair cannot become one preference.
- It is rare. It is **not a safe middle answer**.
- If you use it, write why one preference is not possible.`,
    k: "impossible incomparable option unable judge",
  },
];

for (const item of FAQ) {
  if (item.href && String(item.href).startsWith("/")) {
    delete item.href;
    delete item.hrefLabel;
  }
}
globalThis.FAQ = FAQ;
globalThis.FAQ_GROUPS = FAQ_GROUPS;

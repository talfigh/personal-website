# Setup guide

Everything you need to get from this folder to a live site, in order. Each
step says what you need, where to get it, and what it costs. Prices are in
USD, were checked in November 2026, and can change, so check the linked page
before you pay.

## What you need

| Item                            | Where                   | Cost                        |
| ------------------------------- | ----------------------- | --------------------------- |
| GitHub account                  | github.com              | Free                        |
| Tools on your computer          | Step 2                  | Free                        |
| AWS account                     | aws.amazon.com          | Pay as you go               |
| Domain name (.com)              | AWS Route 53            | About $16 a year            |
| DNS hosted zone                 | Created with the domain | $0.50 a month               |
| Hosting (S3, CloudFront, HTTPS) | AWS, set up by OpenTofu | Usually a few cents a month |
| Claude Code                     | code.claude.com         | Included with a Claude plan |

Expect roughly **$22 to $25 a year** in total. A budget alert (set up in step 7) emails you if AWS spend passes $5 in a month.

---

## 1. Create a GitHub account

1. Sign up at <https://github.com/signup>.
2. Turn on two-factor authentication: Settings → Password and
   authentication → Enable two-factor authentication.

## 2. Install the tools

You need Git, Node.js 26, gitleaks (secret scanner), OpenTofu, the AWS CLI,
and Claude Code.

**macOS** (with [Homebrew](https://brew.sh)):

```sh
brew install git fnm gitleaks opentofu awscli
fnm install 26 && fnm default 26        # Node.js 26 LTS
curl -fsSL https://claude.ai/install.sh | bash   # Claude Code
```

**Windows:** the simplest route is WSL 2 (Ubuntu), then follow the Linux
links below inside it. Native Windows installers also exist on each page.

| Tool        | Official install page                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| Git         | <https://git-scm.com/downloads>                                                 |
| Node.js 26  | <https://nodejs.org/en/download> (or `fnm`/`nvm`)                               |
| gitleaks    | <https://github.com/gitleaks/gitleaks#installing>                               |
| OpenTofu    | <https://opentofu.org/docs/intro/install/>                                      |
| AWS CLI v2  | <https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html> |
| Claude Code | <https://code.claude.com/docs/en/setup>                                         |

Check: `git --version`, `node --version` (v26), `gitleaks version`,
`tofu --version` (1.10 or newer), `aws --version`, `claude --version`.

## 3. Put the project on GitHub

Keep the repository **public**. Nothing secret is ever in it, it shows
your code to recruiters, and on the free GitHub plan the `production`
environment and its secrets (step 8) only work in public repositories.

```sh
cd personal-website
git init -b main
npm ci                    # installs dependencies and the pre-commit hook
git add -A
git commit -m "chore: initial project setup"
```

The commit runs the secret scanner first. If it says gitleaks isn't
installed, finish step 2.

Create an empty repository named `personal-website` at
<https://github.com/new> (no README, no .gitignore), then:

```sh
git remote add origin https://github.com/<your-username>/personal-website.git
git push -u origin main
```

Then, in the repository on GitHub:

1. **Settings → Advanced Security** (may be labelled "Code security"):
   turn on Secret Protection / secret scanning and **Push protection**, plus
   Dependabot alerts and security updates.
2. **Settings → Rules → Rulesets → New branch ruleset** for `main`:
   require a pull request before merging, require status checks to pass
   (`Secret scan`, `Site (format, lint, build, test)`, `Infra (fmt,
validate)`), and block force pushes.
3. **Settings → General → Pull Requests:** allow squash merging only, and
   turn on "Automatically delete head branches".

## 4. Run the site locally

```sh
npm run dev                         # http://localhost:5173
npx playwright install chromium     # once, for tests
npm run check                       # format, lint, build, tests
```

Edit your content in `src/content/resume.ts`. Add your GitHub link there
once the repo is public.

## 5. Create and secure an AWS account

1. Sign up at <https://aws.amazon.com/free>. A payment card is required.
2. Sign in as the root user and turn on MFA (account menu → Security
   credentials). After that, **don't use the root user day to day, and never
   create access keys for it.**
3. Open **IAM Identity Center**, enable it, create a user for yourself, and
   give it the `AdministratorAccess` permission set on your account.
4. On your computer, sign in through Identity Center (no stored keys):

```sh
aws configure sso          # profile name: personal, region: ca-central-1
aws sso login --profile personal
export AWS_PROFILE=personal
```

## 6. Register the domain

In the AWS console: **Route 53 → Registered domains → Register domains**.

- A `.com` is about $16 a year. A `.ca` is also available but is only open
  to people and organizations that meet CIRA's Canadian presence
  requirements, and the registry doesn't allow deleting a `.ca`; you
  turn off auto-renew and let it expire.
- Keep **privacy protection on**. It hides your name, home address, and
  phone number from public WHOIS lookups.
- Confirm the email AWS sends to verify your contact details, or the domain
  can be suspended.
- Registration creates the DNS hosted zone automatically. Don't create
  another one.

## 7. Create the infrastructure with OpenTofu

**a. One-time: a bucket for OpenTofu's state.** This is the only AWS
resource created by hand. Pick a globally unique name:

```sh
STATE_BUCKET=<yourname>-tofu-state
aws s3api create-bucket --bucket "$STATE_BUCKET" --region ca-central-1 \
  --create-bucket-configuration LocationConstraint=ca-central-1
aws s3api put-bucket-versioning --bucket "$STATE_BUCKET" \
  --versioning-configuration Status=Enabled
aws s3api put-public-access-block --bucket "$STATE_BUCKET" \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

**b. Local config files** (both gitignored, so they never reach GitHub):

```sh
cd infra
cp backend.hcl.example backend.hcl            # put your state bucket name in it
cp terraform.tfvars.example terraform.tfvars  # domain, github repo, alert email
```

**c. Create everything:**

```sh
tofu init -backend-config=backend.hcl
tofu plan          # read it: S3, CloudFront, certificate, DNS, deploy role, budget
tofu apply
```

The first apply takes about 5 to 15 minutes (CloudFront and the certificate
are the slow parts). Then commit the provider lock file OpenTofu created:

```sh
git switch -c infra/lock-file
git add .terraform.lock.hcl && git commit -m "chore(infra): add provider lock file"
git push -u origin infra/lock-file     # then open and merge the PR
```

## 8. Connect GitHub to AWS

On GitHub: **Settings → Environments → New environment** named
`production`. Under "Deployment branches and tags" choose **Selected
branches** and add `main`.

Then add the three values as environment secrets. With the
[GitHub CLI](https://cli.github.com) (`gh auth login` first), from `infra/`,
the values go straight from OpenTofu to GitHub without being shown on
screen:

```sh
gh secret set AWS_DEPLOY_ROLE_ARN        --env production --body "$(tofu output -raw deploy_role_arn)"
gh secret set SITE_BUCKET                --env production --body "$(tofu output -raw site_bucket)"
gh secret set CLOUDFRONT_DISTRIBUTION_ID --env production --body "$(tofu output -raw cloudfront_distribution_id)"
gh variable set SITE_URL                 --env production --body "$(tofu output -raw site_url)"
gh variable set DEPLOY_ENABLED --body true      # turns on the deploy job
```

Until `DEPLOY_ENABLED` is set, the pipeline runs every check but skips the
deploy, so pushes made before this step don't fail.

No AWS access keys are involved. GitHub gets a short-lived token per deploy,
and the role can only update this one site.

## 9. Deploy

Every merge to `main` deploys. To trigger the first one, go to **Actions →
Pipeline → Run workflow** on `main`, or merge any pull request. When the
`Deploy to AWS` job is green, open `https://<your-domain>`.

## 10. Day-to-day with Claude Code

```sh
cd personal-website
claude
```

Claude reads `CLAUDE.md` automatically, so it follows the same stack,
workflow, and security rules every time. Example requests:

- "Update my experience with my new job: …"
- "Add a Projects section with these three projects: …"
- "Open a PR for this change."

For a bigger change, Claude will propose a new entry in
`docs/DECISIONS.md` before switching any tool or approach.

## If a secret ever leaks

Revoke or rotate it first (in AWS, GitHub, or wherever it came from), then
remove it from the repo. Deleting the commit doesn't make it safe: anything
that reached GitHub must be treated as exposed.

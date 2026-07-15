# AI Matter / 智能新知

A bilingual publishing shell for AI, machine learning, data stories, and visual process maps. Paste English and Chinese content into the Studio, add numbered process steps, and publish a new article route.

## What works now

- English / 中文 interface switch
- Bilingual story editor
- Automatic visual process-map structure from numbered lines
- Dynamic article pages at `/insights/[slug]`
- Local draft persistence in the browser
- Responsive editorial design
- Google AI Studio import metadata
- Automated GitHub → Google Cloud Run deployment

Local drafts are deliberately device-local in this first shell. A shared database and Gemini-powered translation/generation can be connected in the next phase without redesigning the interface.

## Develop locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

For the production Cloud Run build:

```bash
npm run build:cloud
npm start
```

## Import into Google AI Studio

In Google AI Studio Build mode, choose **Add files → Import from GitHub** and select `icetonges/aimattergoogle`. AI Studio can preview and modify the repository. Production deployment uses Cloud Run, which is also the deployment service used by AI Studio.

## One-time GitHub → Cloud Run setup

The workflow uses keyless Workload Identity Federation. In GitHub repository settings, add:

- Repository variable: `GCP_PROJECT_ID`
- Repository secret: `GCP_WIF_PROVIDER`
- Repository secret: `GCP_SERVICE_ACCOUNT`

The Google service account needs permissions to deploy Cloud Run, push Artifact Registry images, create the `aimatter-web` repository on the first run, and act as the runtime service account. Restrict the Workload Identity provider to the `icetonges/aimattergoogle` repository. After setup, every push to `main` tests, builds, and deploys the site.

Official references: [Google AI Studio Build mode](https://ai.google.dev/gemini-api/docs/aistudio-build-mode), [Google GitHub authentication](https://github.com/google-github-actions/auth), and [Cloud Run deployment action](https://github.com/google-github-actions/deploy-cloudrun).

## Domain note

Cloud Run provides a public `run.app` URL automatically. `aimatter.ai.studio` and `datamatter.ai.studio` cannot be registered by this project because `ai.studio` is Google's domain. For a branded address, register a domain you own (for example `aimatter.ai`) and map it to Cloud Run using a load balancer or Firebase Hosting.

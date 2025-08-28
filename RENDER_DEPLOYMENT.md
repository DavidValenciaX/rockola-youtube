# Render Deployment Configuration

## Option 1: Using Render Dashboard (Recommended)

Configure these settings in your Render service dashboard:

### Service Settings:
- **Root Directory**: `./` (or leave empty)
- **Pre-Deploy Command**: `npm install --include=dev`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### Environment Variables:
- **NODE_ENV**: `production`

## Option 2: Using render.yaml

The render.yaml file in the root directory should automatically configure the deployment.

## Option 3: Alternative Commands

If you encounter issues, try these alternative commands:

### Pre-Deploy Command alternatives:
```bash
# Option A
npm install --include=dev

# Option B
npm ci --include=dev

# Option C
npm install && npm install --only=dev
```

### Build Command alternatives:
```bash
# Option A
npm run build

# Option B
npx vite build

# Option C
./node_modules/.bin/vite build
```

## Troubleshooting

If the build still fails:
1. Ensure Node.js version is set to 20 (via .nvmrc file)
2. Verify all build dependencies are in `dependencies` section of package.json
3. Check that vite.config.js can import from 'vite' package
4. Try clearing Render's build cache and redeploying

## Dependencies Note

The following packages are in `dependencies` (not `devDependencies`) because they're needed for the build process:
- vite
- svelte  
- @sveltejs/vite-plugin-svelte
# Vite Module Federation Guide

A comprehensive guide for implementing micro-frontends using Vite Module Federation. This allows you to create independent React applications that can share components at runtime.

## 🏗️ Architecture Overview

- **Host Application**: The main app that consumes federated modules (e.g., Stride Command Center)
- **Remote Application**: Independent micro-frontend that exposes components via module federation
- **Runtime Integration**: Components are loaded dynamically at runtime, not build time

## 🚀 Quick Start

### For This Demo Project

1. **Start the Micro Frontend**:
   ```bash
   cd micro-frontend
   npm install
   npm run build
   npx http-server dist -p 3001 --cors
   ```

2. **Start the Main Application**:
   ```bash
   # In the root directory
   pnpm install
   pnpm run dev
   ```

3. **Access the Demo**:
   - Open `http://localhost:8080`
   - Navigate to "Module Federation" in the sidebar
   - Click "Show Federated Component"

## 📋 Step-by-Step Implementation Guide

### Step 1: Create a Remote Application (Micro-Frontend)

#### 1.1 Initialize the Project
```bash
npm create vite@latest my-micro-frontend -- --template react-ts
cd my-micro-frontend
npm install
```

#### 1.2 Install Module Federation Plugin
```bash
npm install @originjs/vite-plugin-federation --save-dev
```

#### 1.3 Configure Vite for Module Federation
Create/update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'myMicroFrontend',
      filename: 'remoteEntry.js',
      exposes: {
        './MyComponent': './src/components/MyComponent.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  },
  server: {
    port: 3001,
    cors: true
  }
})
```

#### 1.4 Create a Component to Expose
Create `src/components/MyComponent.tsx`:

```typescript
import React from 'react'

interface MyComponentProps {
  title?: string
  onClick?: () => void
}

const MyComponent: React.FC<MyComponentProps> = ({
  title = 'Hello from Micro-Frontend!',
  onClick
}) => {
  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
      <button
        onClick={onClick}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Click Me!
      </button>
    </div>
  )
}

export default MyComponent
```

#### 1.5 Build and Serve the Remote
```bash
# Build the micro-frontend
npm run build

# Serve the built files (choose one method)
# Method 1: Using http-server (recommended)
npx http-server dist -p 3001 --cors

# Method 2: Using Python
cd dist && python3 -m http.server 3001

# Method 3: Using serve
npx serve dist -p 3001 --cors
```

### Step 2: Configure Host Application (Main App)

#### 2.1 Install Module Federation Plugin
```bash
npm install @originjs/vite-plugin-federation --save-dev
```

#### 2.2 Update Vite Configuration
Add to your `vite.config.ts`:

```typescript
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'hostApp',
      remotes: {
        myMicroFrontend: 'http://localhost:3001/assets/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      }
    }),
    // ... other plugins
  ],
  // ... rest of config
})
```

#### 2.3 Create TypeScript Declarations
Create `src/types/federation.d.ts`:

```typescript
declare module 'myMicroFrontend/MyComponent' {
  import React from 'react';

  interface MyComponentProps {
    title?: string;
    onClick?: () => void;
  }

  const MyComponent: React.FC<MyComponentProps>;
  export default MyComponent;
}
```

#### 2.4 Use the Federated Component
Create a component that uses the federated module:

```typescript
import React, { Suspense, lazy } from 'react';

// Lazy load the federated component
const MyComponent = lazy(() => import('myMicroFrontend/MyComponent'));

const FederatedDemo: React.FC = () => {
  const handleClick = () => {
    console.log('Federated component clicked!');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Module Federation Demo</h2>

      <Suspense
        fallback={
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Loading federated component...
          </div>
        }
      >
        <ErrorBoundary>
          <MyComponent
            title="Component from Micro-Frontend"
            onClick={handleClick}
          />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

// Error boundary for graceful fallbacks
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50">
          <p className="text-red-800">
            Failed to load federated component.
            Make sure the micro-frontend is running on http://localhost:3001
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FederatedDemo;
```

## 🔧 How It Works

### Remote Application (Micro-Frontend)

1. **Exposes Components**: Uses `exposes` configuration to make components available
2. **Generates Remote Entry**: Creates `remoteEntry.js` that acts as the module registry
3. **Shares Dependencies**: Avoids duplication by sharing React/React-DOM with host

```typescript
// Remote app exposes components
federation({
  name: 'myMicroFrontend',
  filename: 'remoteEntry.js',
  exposes: {
    './MyComponent': './src/components/MyComponent.tsx',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
})
```

### Host Application (Main App)

1. **Consumes Remotes**: Configures which remote applications to load from
2. **Dynamic Loading**: Components are loaded at runtime, not build time
3. **Shared Context**: Shares React context and state management across modules

```typescript
// Host app consumes remote modules
federation({
  name: 'hostApp',
  remotes: {
    myMicroFrontend: 'http://localhost:3001/assets/remoteEntry.js',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
})
```

### Runtime Loading Process

1. **Lazy Import**: `const Component = lazy(() => import('remote/Component'))`
2. **Remote Entry Fetch**: Downloads `remoteEntry.js` from the remote server
3. **Module Resolution**: Resolves the specific component from the remote module map
4. **Dependency Sharing**: Uses shared React/React-DOM instances
5. **Component Rendering**: Renders the component as if it were local

## 🎯 Best Practices

### Development Workflow

1. **Build Remote First**: Always build and serve the remote application before testing
2. **Use Error Boundaries**: Wrap federated components in error boundaries
3. **Implement Loading States**: Use Suspense for better user experience
4. **Version Management**: Use semantic versioning for remote applications

### Serving Remote Applications

#### Production-Ready Serving (Recommended)
```bash
# Build the remote
npm run build

# Serve with proper CORS headers
npx http-server dist -p 3001 --cors
```

#### Development Serving (Alternative Methods)
```bash
# Method 1: Python HTTP Server
cd dist && python3 -m http.server 3001

# Method 2: Node.js serve package
npx serve dist -p 3001 --cors

# Method 3: Vite preview (may have routing issues)
npm run preview -- --port 3001
```

### Error Handling

Always implement proper error boundaries and fallbacks:

```typescript
// Comprehensive error boundary
class FederationErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Federation Error:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 rounded bg-red-50">
          <h3 className="font-semibold text-red-800">Component Unavailable</h3>
          <p className="text-red-600">
            The remote component failed to load. Please try again later.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

## ✨ Key Features & Benefits

1. **🔄 Runtime Loading**: Components loaded dynamically, enabling hot updates
2. **🏗️ Independent Development**: Teams can work on separate micro-frontends
3. **📦 Shared Dependencies**: Avoid duplication of common libraries
4. **🛡️ Error Isolation**: Failed remotes don't crash the entire application
5. **🔧 TypeScript Support**: Full type safety with proper declarations
6. **🚀 Scalable Architecture**: Easy to add new micro-frontends

## 📁 Project Structure

```
your-main-app/
├── src/
│   ├── components/
│   │   └── FederatedDemo.tsx      # Component using federated modules
│   ├── types/
│   │   └── federation.d.ts        # TypeScript declarations
│   └── ...
├── vite.config.ts                 # Host federation config
└── package.json

my-micro-frontend/                 # Separate repository/folder
├── src/
│   ├── components/
│   │   └── MyComponent.tsx        # Component to expose
│   ├── App.tsx
│   └── main.tsx
├── dist/                          # Built files (after npm run build)
│   ├── assets/
│   │   ├── remoteEntry.js         # Federation entry point
│   │   └── ...
│   └── index.html
├── vite.config.ts                 # Remote federation config
└── package.json
```

## 🔄 Adding New Federated Components

### In the Remote Application:

1. **Create Component**: Add your component in `src/components/`
2. **Export Component**: Update `vite.config.ts` exposes section:
   ```typescript
   exposes: {
     './MyComponent': './src/components/MyComponent.tsx',
     './NewComponent': './src/components/NewComponent.tsx', // Add this
   }
   ```
3. **Rebuild**: Run `npm run build` and restart the server

### In the Host Application:

1. **Add Type Declarations**: Update `src/types/federation.d.ts`:
   ```typescript
   declare module 'myMicroFrontend/NewComponent' {
     const NewComponent: React.FC<NewComponentProps>;
     export default NewComponent;
   }
   ```
2. **Use Component**: Import and use with lazy loading:
   ```typescript
   const NewComponent = lazy(() => import('myMicroFrontend/NewComponent'));
   ```

## 🚀 Production Deployment

### Remote Application Deployment

1. **Build for Production**:
   ```bash
   npm run build
   ```

2. **Deploy Static Files**: Deploy the `dist` folder to a CDN or static hosting
   - AWS S3 + CloudFront
   - Vercel/Netlify
   - Azure Static Web Apps
   - Google Cloud Storage

3. **Update Remote URLs**: Update host app configuration:
   ```typescript
   remotes: {
     myMicroFrontend: 'https://my-micro-frontend.cdn.com/assets/remoteEntry.js',
   }
   ```

### Host Application Deployment

1. **Environment Configuration**: Use environment variables for remote URLs:
   ```typescript
   remotes: {
     myMicroFrontend: process.env.VITE_MICRO_FRONTEND_URL || 'http://localhost:3001/assets/remoteEntry.js',
   }
   ```

2. **Build and Deploy**: Standard deployment process for your main application

## 🛠️ Advanced Configuration

### Multiple Remotes
```typescript
federation({
  name: 'hostApp',
  remotes: {
    microFrontend1: 'http://localhost:3001/assets/remoteEntry.js',
    microFrontend2: 'http://localhost:3002/assets/remoteEntry.js',
    microFrontend3: 'http://localhost:3003/assets/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    'react-router-dom': { singleton: true },
  }
})
```

### Conditional Loading
```typescript
const loadMicroFrontend = async (name: string) => {
  try {
    const module = await import(`${name}/Component`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load ${name}:`, error);
    return null;
  }
};
```

### Shared State Management
```typescript
// Share Zustand store across micro-frontends
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true },
  zustand: { singleton: true },
}
```

## 🐛 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Module not found** | Remote not running/accessible | Ensure remote is built and served on correct port |
| **CORS errors** | Missing CORS headers | Use `--cors` flag when serving or configure server |
| **TypeScript errors** | Missing type declarations | Add proper declarations in `federation.d.ts` |
| **Shared dependency conflicts** | Version mismatches | Ensure compatible versions in both apps |
| **404 on remoteEntry.js** | Incorrect path/serving | Check build output and serving configuration |

### Debug Steps

1. **Check Remote Entry**: Verify `http://localhost:3001/assets/remoteEntry.js` is accessible
2. **Browser DevTools**: Check Network tab for failed requests
3. **Console Logs**: Look for federation-specific error messages
4. **Build Output**: Verify `remoteEntry.js` exists in build output

### Development Tips

```bash
# Quick test if remote is accessible
curl http://localhost:3001/assets/remoteEntry.js

# Check what's being served
ls -la micro-frontend/dist/assets/

# Verify CORS headers
curl -I -H "Origin: http://localhost:8080" http://localhost:3001/assets/remoteEntry.js
```

## 📚 Practical Examples

### Example 1: Shared UI Component Library
```typescript
// Remote: ui-components/vite.config.ts
exposes: {
  './Button': './src/components/Button.tsx',
  './Modal': './src/components/Modal.tsx',
  './Form': './src/components/Form.tsx',
}

// Host: Use shared components
const Button = lazy(() => import('uiComponents/Button'));
const Modal = lazy(() => import('uiComponents/Modal'));
```

### Example 2: Feature-Based Micro-Frontend
```typescript
// Remote: user-management/vite.config.ts
exposes: {
  './UserProfile': './src/pages/UserProfile.tsx',
  './UserSettings': './src/pages/UserSettings.tsx',
  './UserList': './src/pages/UserList.tsx',
}

// Host: Route to micro-frontend pages
<Route path="/users/*" element={
  <Suspense fallback={<Loading />}>
    <UserManagementApp />
  </Suspense>
} />
```

### Example 3: Plugin Architecture
```typescript
// Dynamic plugin loading
const loadPlugin = async (pluginName: string) => {
  try {
    const plugin = await import(`${pluginName}/Plugin`);
    return plugin.default;
  } catch {
    return null; // Plugin not available
  }
};

// Use in component
const [plugins, setPlugins] = useState([]);

useEffect(() => {
  const loadAvailablePlugins = async () => {
    const pluginNames = ['analytics', 'reporting', 'notifications'];
    const loadedPlugins = await Promise.all(
      pluginNames.map(name => loadPlugin(name))
    );
    setPlugins(loadedPlugins.filter(Boolean));
  };

  loadAvailablePlugins();
}, []);
```

## 🎯 Quick Reference

### Essential Commands
```bash
# Remote setup
npm create vite@latest my-remote -- --template react-ts
npm install @originjs/vite-plugin-federation --save-dev
npm run build
npx http-server dist -p 3001 --cors

# Host setup
npm install @originjs/vite-plugin-federation --save-dev
# Update vite.config.ts with federation config
npm run dev
```

### Key Configuration Points
```typescript
// Remote (exposes components)
federation({
  name: 'remoteName',
  filename: 'remoteEntry.js',
  exposes: { './Component': './src/Component.tsx' },
  shared: { react: { singleton: true } }
})

// Host (consumes components)
federation({
  name: 'hostName',
  remotes: { remoteName: 'http://localhost:3001/assets/remoteEntry.js' },
  shared: { react: { singleton: true } }
})
```

### Usage Pattern
```typescript
// 1. Lazy import
const RemoteComponent = lazy(() => import('remoteName/Component'));

// 2. Use with Suspense and Error Boundary
<Suspense fallback={<Loading />}>
  <ErrorBoundary>
    <RemoteComponent />
  </ErrorBoundary>
</Suspense>
```

---

## 🤝 Contributing

When working with module federation in a team:

1. **Document Remote APIs**: Maintain clear documentation of exposed components
2. **Version Control**: Use semantic versioning for breaking changes
3. **Testing**: Test integration between host and remote applications
4. **Communication**: Coordinate deployments between teams
5. **Monitoring**: Monitor remote loading performance and errors

## 📖 Additional Resources

- [Vite Module Federation Plugin](https://github.com/originjs/vite-plugin-federation)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
- [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Micro-Frontend Architecture Patterns](https://martinfowler.com/articles/micro-frontends.html)

---

**Happy coding with Module Federation! 🚀**

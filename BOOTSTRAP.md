# Bootstrap Instructions

This document provides step-by-step instructions for setting up the infrastructure on a fresh K3s cluster.

## Prerequisites

- K3s cluster running
- kubectl configured to access the cluster
- Helmfile installed

## Step 1: Install Infrastructure Components

Use Helmfile to install the core infrastructure components:

```bash
# Install cert-manager, MetalLB, and ArgoCD with proper dependencies
helmfile sync
```

This installs:
- **cert-manager** in `cert-manager` namespace (with CRDs)
- **MetalLB** in `metallb-system` namespace  
- **ArgoCD** in `argocd` namespace (in insecure mode for Traefik)

## Step 2: Access ArgoCD

```bash
# Get the admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward to access locally
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

- Open browser to https://localhost:8080
- Username: `admin`
- Password: (from the command above)
- Accept the self-signed certificate

## Step 3: Configure ArgoCD to Manage Infrastructure

1. In the ArgoCD UI, click **"+ NEW APP"**
2. Configure the application:
   - **Application Name**: `timothyw-infrastructure`
   - **Project**: `default`
   - **Sync Policy**: `Manual`
   
   **Source:**
   - **Repository URL**: `https://github.com/your-username/timothyw.dev` (update with your repo)
   - **Revision**: `HEAD`
   - **Path**: `helm`
   
   **Destination:**
   - **Cluster URL**: `https://kubernetes.default.svc`
   - **Namespace**: `timothyw-system`

3. Click **CREATE**

## Step 4: Sync the Infrastructure Configuration

1. In ArgoCD UI, find your `timothyw-infrastructure` application
2. Click **SYNC**
3. ArgoCD will deploy the configuration resources:
   - ClusterIssuer for Let's Encrypt
   - MetalLB IP pool configuration
   - ArgoCD IngressRoute
   - Kubernetes Dashboard (if enabled)
4. Click **SYNCHRONIZE**

## Step 5: DNS Configuration

Point your DNS records to your cluster's external IP:
- `argocd.timothyw.dev` → `51.81.211.182`
- `k8s.timothyw.dev` → `51.81.211.182`

## Step 6: Verify Setup

After DNS propagation, you should be able to access:
- ArgoCD: https://argocd.timothyw.dev
- Kubernetes Dashboard: https://k8s.timothyw.dev (if enabled)

## Next Steps

Once ArgoCD is managing your infrastructure configuration, you can:
1. Add more applications to ArgoCD
2. Set up automatic sync policies
3. Configure RBAC and SSO
4. Set up monitoring and alerts

## Notes

- **Helmfile** handles the initial infrastructure installation (run once)
- **ArgoCD** handles ongoing GitOps for configuration and applications  
- Infrastructure components are installed in their proper namespaces
- If sync fails, ensure all infrastructure pods are running first
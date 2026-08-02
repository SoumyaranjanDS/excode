# Complete AWS EC2 Deployment Guide (React + Node.js)

This guide provides a complete, step-by-step walkthrough for deploying a full-stack application (Vite/React frontend, Express/Node.js backend) to a single AWS EC2 instance.

---

## Phase 1: AWS Infrastructure Setup

### 1. Create the EC2 Instance
1. Go to the AWS EC2 Dashboard and click **Launch Instance**.
2. **Name**: `<your-project-name>`
3. **OS**: Select **Ubuntu** (the default latest LTS version).
4. **Instance Type**: `t2.micro` or `t3.micro` (Free Tier eligible).
5. **Key Pair**: Create a new key pair (RSA, `.pem` format), name it `<your-key-name>`, and download it to your local machine.

### 2. Configure Security Group (Firewall)
Under the **Network settings** section, ensure the following Inbound Rules are created so your server is accessible:
- **SSH** | Port `22` | Source: `0.0.0.0/0` (Allows terminal access)
- **HTTP** | Port `80` | Source: `0.0.0.0/0` (Allows Let's Encrypt and standard web traffic)
- **HTTPS** | Port `443` | Source: `0.0.0.0/0` (Allows secure SSL traffic)

### 3. Assign an Elastic IP
1. On the left sidebar, click **Elastic IPs**.
2. Click **Allocate Elastic IP address** and save.
3. Select the new IP, click **Actions > Associate Elastic IP address**.
4. Choose your running `<your-project-name>` instance and associate it.
5. Take note of your new Elastic IP: `<your-elastic-ip>`

---

## Phase 2: Connect to Your Server

### 1. Fix Key Permissions (Windows Only)
Open PowerShell, navigate to where your downloaded `.pem` key is, and run:
```powershell
icacls.exe "<your-key-name>.pem" /reset
icacls.exe "<your-key-name>.pem" /grant:r "$($env:USERNAME):(r)"
icacls.exe "<your-key-name>.pem" /inheritance:r
```

### 2. Connect via SSH
Connect to your server using the Elastic IP:
```bash
ssh -i "<your-key-name>.pem" ubuntu@<your-elastic-ip>
```
*(Type `yes` when prompted about the fingerprint).*

---

## Phase 3: Server Preparation

Once logged into your EC2 terminal, run these commands to install the required software:

### 1. Update and Install Dependencies
```bash
# Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx and PM2
sudo apt install -y nginx
sudo npm install -g pm2
```

### 2. Create Directory and Clone Code
```bash
# Create the standard web directory
sudo mkdir -p /var/www/<your-project-folder>

# Give your 'ubuntu' user ownership so you can clone without sudo
sudo chown -R ubuntu:ubuntu /var/www/<your-project-folder>

# Clone your repository
git clone <your-github-repo-url> /var/www/<your-project-folder>
```

---

## Phase 4: Application Setup

### 1. Backend Setup (Node.js)
```bash
cd /var/www/<your-project-folder>/<your-backend-folder>

# Install dependencies
npm install

# Create environment variables file
nano .env
```
*(Add your environment variables inside nano. Make sure to set `PORT=3000` and `FRONTEND_URL=https://<your-domain>`. Save with `Ctrl+O`, `Enter`, `Ctrl+X`).*

```bash
# Start the backend with PM2
pm2 start <your-server-entry-file.js> --name "<your-app-name>"

# Save PM2 configuration to survive server reboots
pm2 save
pm2 startup
```
*(Copy and run the `sudo env PATH...` command that `pm2 startup` outputs).*

### 2. Frontend Setup (React/Vite)
```bash
cd /var/www/<your-project-folder>/<your-frontend-folder>

# Install dependencies
npm install

# Create environment variables file (if needed)
nano .env
# (Ensure your API URL points to: VITE_API_URL=https://<your-domain>)

# Build for production
npm run build
```

---

## Phase 5: Domain and Nginx Configuration

### 1. Update Domain DNS
Go to your domain registrar (GoDaddy, Namecheap, etc.) and update the DNS records:
- **Type**: `A`
- **Name**: `@`
- **Data/Value**: `<your-elastic-ip>`

### 2. Configure Nginx
Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/<your-domain>
```

Paste this configuration, ensuring you update the paths:
```nginx
server {
    listen 80;
    server_name <your-domain> www.<your-domain>;

    # Point this strictly to your frontend 'dist' or 'build' folder
    root /var/www/<your-project-folder>/<your-frontend-folder>/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets to improve performance (Lighthouse caching fix)
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ {
        expires 6M;
        access_log off;
        add_header Cache-Control "public, max-age=15552000, immutable";
        
        # Ensure React handles anything not found in assets
        try_files $uri =404;
    }

    # Proxy API requests to PM2 Backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable the Site
```bash
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Enable your new config
sudo ln -s /etc/nginx/sites-available/<your-domain> /etc/nginx/sites-enabled/

# Test for syntax errors
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Phase 6: Enable Free SSL (HTTPS)

Once your DNS has fully propagated (your domain successfully loads on HTTP), secure it with Let's Encrypt:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Request and install the certificate
sudo certbot --nginx -d <your-domain> -d www.<your-domain>
```

When prompted by Certbot, **always choose to redirect HTTP traffic to HTTPS**. 

**Congratulations! Your application is fully deployed, secure, and live!**

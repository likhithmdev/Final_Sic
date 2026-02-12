#!/bin/bash

# Smart AI Bin - System Verification Script
# Run this after installation to verify everything works

echo "=================================="
echo "Smart AI Bin - System Check"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Not installed"
    echo "  Install from: https://nodejs.org/"
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} Installed: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} Not installed"
fi

# Check MySQL
echo -n "Checking MySQL... "
if command -v mysql &> /dev/null; then
    MYSQL_VERSION=$(mysql --version | awk '{print $5}' | cut -d',' -f1)
    echo -e "${GREEN}✓${NC} Installed: $MYSQL_VERSION"
    
    # Check if MySQL is running
    if systemctl is-active --quiet mysql 2>/dev/null || brew services list 2>/dev/null | grep mysql | grep started &>/dev/null; then
        echo -e "  ${GREEN}✓${NC} MySQL is running"
    else
        echo -e "  ${YELLOW}⚠${NC} MySQL not running. Start with:"
        echo "    sudo systemctl start mysql  (Linux)"
        echo "    brew services start mysql   (Mac)"
    fi
else
    echo -e "${RED}✗${NC} Not installed"
    echo "  Install: sudo apt install mysql-server"
fi

echo ""
echo "=================================="
echo "Project Structure Check"
echo "=================================="
echo ""

# Check if in project directory
if [ -d "server" ] && [ -d "client" ]; then
    echo -e "${GREEN}✓${NC} In project directory"
else
    echo -e "${RED}✗${NC} Not in project root directory"
    echo "  Run this script from: smart-ai-bin/"
    exit 1
fi

# Check server folder
echo -n "Checking server... "
if [ -d "server/src" ] && [ -f "server/package.json" ]; then
    echo -e "${GREEN}✓${NC} Structure OK"
else
    echo -e "${RED}✗${NC} Missing files"
fi

# Check client folder
echo -n "Checking client... "
if [ -d "client/src" ] && [ -f "client/package.json" ]; then
    echo -e "${GREEN}✓${NC} Structure OK"
else
    echo -e "${RED}✗${NC} Missing files"
fi

# Check .env file
echo -n "Checking server/.env... "
if [ -f "server/.env" ]; then
    echo -e "${GREEN}✓${NC} Exists"
    
    # Check if password is default
    if grep -q "DB_PASSWORD=your_password" server/.env; then
        echo -e "  ${YELLOW}⚠${NC} Using default password - please update!"
    fi
    
    if grep -q "JWT_SECRET=your_super_secret" server/.env; then
        echo -e "  ${YELLOW}⚠${NC} Using default JWT secret - please update!"
    fi
else
    echo -e "${RED}✗${NC} Not found"
    echo "  Create server/.env from template"
fi

echo ""
echo "=================================="
echo "Dependencies Check"
echo "=================================="
echo ""

# Check server dependencies
echo -n "Checking server dependencies... "
if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}⚠${NC} Not installed"
    echo "  Run: cd server && npm install"
fi

# Check client dependencies
echo -n "Checking client dependencies... "
if [ -d "client/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}⚠${NC} Not installed"
    echo "  Run: cd client && npm install"
fi

echo ""
echo "=================================="
echo "Port Availability Check"
echo "=================================="
echo ""

# Check port 3000
echo -n "Checking port 3000 (server)... "
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠${NC} Port in use"
    echo "  Stop existing process or change PORT in server/.env"
else
    echo -e "${GREEN}✓${NC} Available"
fi

# Check port 5173
echo -n "Checking port 5173 (client)... "
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠${NC} Port in use"
    echo "  Stop existing Vite server"
else
    echo -e "${GREEN}✓${NC} Available"
fi

echo ""
echo "=================================="
echo "Database Check"
echo "=================================="
echo ""

# Check if can connect to MySQL
echo -n "Testing MySQL connection... "
if mysql -u root --password="" -e "exit" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Connected (no password)"
else
    echo -e "${YELLOW}⚠${NC} Requires password"
    echo "  Ensure server/.env has correct DB_PASSWORD"
fi

# Check if database exists
echo -n "Checking smartbin_db... "
if mysql -u root --password="" -e "USE smartbin_db" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Database exists"
    
    # Check tables
    TABLE_COUNT=$(mysql -u root --password="" -D smartbin_db -e "SHOW TABLES" 2>/dev/null | wc -l)
    if [ $TABLE_COUNT -gt 1 ]; then
        echo -e "  ${GREEN}✓${NC} Tables created ($((TABLE_COUNT - 1)) tables)"
    fi
else
    echo -e "${YELLOW}⚠${NC} Database not created yet"
    echo "  Will be created automatically when server starts"
fi

echo ""
echo "=================================="
echo "Summary"
echo "=================================="
echo ""

echo "Ready to start? Run these commands:"
echo ""
echo "Terminal 1:"
echo "  cd server && npm start"
echo ""
echo "Terminal 2:"
echo "  cd client && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "=================================="

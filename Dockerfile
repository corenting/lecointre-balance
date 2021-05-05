FROM node:14

# Install latest chrome package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Also install dumb-init for entrypoint.
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=$(dpkg --print-architecture)] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 dumb-init \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
ENTRYPOINT ["dumb-init", "--"]

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Copy app
WORKDIR /app
COPY . .

# Install puppeteer so it's available in the container.
RUN npm install \
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser node_modules

# Run everything after as non-privileged user.
USER pptruser

CMD ["node", "index.js"]

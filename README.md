# lecointre-balance

Check account balance on https://7-11h.lecointreparis.com/ and send Telegram notifications if the balance is under 25€.

## Deployement

The following env variables are needed :
- `TELEGRAM_USER` : the ID of the telegram user you want to send the message to
- `TELEGRAM_KEY` : your TELEGRAM bot key
- `LC_USERNAME` : your username on Lecointre
- `LC_PASSWORD` : your password on Lecointre

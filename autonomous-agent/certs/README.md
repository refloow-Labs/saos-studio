# Extra CA certificates (προαιρετικό)

Αν το `docker compose build agent` αποτυγχάνει με σφάλμα τύπου
`unable to get local issuer certificate` ή `self-signed certificate in certificate chain`,
τότε κάποιο antivirus (π.χ. Norton) ή εταιρικό proxy υποκλέπτει την HTTPS κίνηση.

**Λύση:** αντίγραψε το CA πιστοποιητικό του εδώ με κατάληξη `.crt` και ξαναχτίσε:

```bash
# Windows (Norton)
cp "/c/ProgramData/Norton/Antivirus/wscert.pem" certs/norton.crt

# macOS / εταιρικό proxy: εξήγαγε το CA από το Keychain σε .crt
docker compose build agent
```

Το πιστοποιητικό **προστίθεται** στο trust store του container — δεν απενεργοποιείται
ποτέ ο έλεγχος πιστοποιητικών.

⚠️ Τα `.crt` εδώ είναι ανά μηχάνημα και **δεν** μπαίνουν στο git (δες το `.gitignore`).
Μόνο αυτό το README παρακολουθείται.

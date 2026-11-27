const keys = `skip country hero intro check label submit privacyHint warnings legal news protection sources archive archiveNote proof help helpText self selfText complaint complaintText privacy privacyText independence method methodText unavailable fallback pending invalid warning historical conflict listed unknown stale checked retrieved original statusOk statusUnavailable statusStale publications pdf more`.split(' ');

const translations = {
es: [
'Ir al contenido','República Dominicana','Verifica antes de confiar.','Consulta dominios de juegos de azar, avisos oficiales y recursos de protección al consumidor en República Dominicana.',
'Verificar un dominio','Dominio o URL','Consultar','La consulta se procesa en tu dispositivo.',
'Radar de alertas','Radar legal','Noticias oficiales','Protección del jugador','Fuentes y metodología',
'Avisos históricos','Estos avisos reflejan lo que publicó la autoridad en la fecha indicada. La situación de un dominio puede haber cambiado.',
'Fuente oficial','Pide apoyo','Si te cuesta parar o intentas recuperar pérdidas, aléjate del juego. Habla con alguien de confianza y busca apoyo especializado.','Solicita la autoexclusión','Consulta el formulario de la autoridad y pregunta por su alcance y duración.','Presenta una denuncia','Guarda capturas, fechas y comprobantes. Envía tus datos solo por un canal oficial.',
'Privacidad','La consulta no se envía al servidor ni se guarda en este sitio. No usamos cookies propias, analítica ni rastreadores publicitarios. Cloudflare aloja el portal y puede procesar datos técnicos de conexión. Los sitios oficiales aplican sus propias políticas.',
'Portal independiente de información y protección al consumidor. Sin publicidad, afiliación ni servicios de apuestas. La información jurídica es orientativa.',
'Cómo interpretamos los datos','Comparamos el nombre de host exacto, incluida cualquier variante con www. Una coincidencia indica que el dominio figura en la fuente. La ausencia de coincidencias no acredita una licencia. Los datos de consulta caducan después de 72 horas sin una descarga válida.',
'No podemos verificar el estado actual con los datos disponibles. Consulta a la autoridad.',
'Consulta el registro oficial','Introduce un dominio para consultar las fuentes disponibles.','Introduce un dominio válido, con o sin https://.',
'El dominio figura en la lista de advertencias consultada. Confirma su situación con la autoridad.',
'El dominio aparece en una advertencia histórica o en una copia anterior. Su estado actual requiere confirmación.',
'Las fuentes contienen registros contradictorios. Confirma el estado con la autoridad.',
'El dominio figura en el registro oficial consultado. Comprueba el alcance y la vigencia con la autoridad.',
'No hay coincidencia exacta en las fuentes consultadas. Esto no confirma una autorización.',
'Copia anterior. Puede haber publicaciones más recientes.','Último intento','Última descarga válida','Publicación original en español','Disponible','Sin datos verificables','Datos antiguos','Publicaciones de la DGJA','Documento oficial','Abrir fuente'
],
en: [
'Skip to content','Dominican Republic','Check before you trust.','Look up gambling domains, official notices and consumer protection resources in the Dominican Republic.',
'Check a domain','Domain or URL','Check domain','Your lookup stays on your device.',
'Warning radar','Legal radar','Official news','Player protection','Sources and methodology',
'Historical notices','These notices reflect what the authority published on the date shown. A domain’s status may have changed.',
'Official source','Get support','If you find it hard to stop or you are chasing losses, step away from gambling. Talk to someone you trust and seek specialist support.','Request self-exclusion','Use the authority’s form and ask which services it covers and how long it lasts.','File a complaint','Keep screenshots, dates and receipts. Share your personal details only through an official channel.',
'Privacy','Your lookup is never sent to the server or stored by this site. We use no first-party cookies, analytics or advertising trackers. Cloudflare hosts the site and may process technical connection data. Official sites have their own privacy policies.',
'Independent consumer information and protection portal. No advertising, affiliates or gambling services. Legal information is provided for general guidance.',
'How we interpret the data','We compare exact hostnames, including any www prefix. A match means the hostname appears in that source. A missing match does not establish licensing status. Lookup data expires after 72 hours without a valid download.',
'The available data cannot confirm current status. Check with the authority.',
'Open the official register','Enter a domain to check available sources.','Enter a valid domain, with or without https://.',
'This domain appears in the warning list we retrieved. Confirm its status with the authority.',
'This domain appears in a historical warning or an older copy. Confirm its current status with the authority.',
'The sources contain conflicting records. Confirm the status with the authority.',
'This domain appears in the official register we retrieved. Confirm the scope and validity with the authority.',
'No exact match in the sources we checked. This does not confirm authorisation.',
'Older snapshot. Newer publications may exist.','Last check attempt','Last successful download','Original publication in Spanish','Available','No verifiable data','Outdated data','DGJA publications','Official document','Open source'
],
de: [
'Zum Inhalt','Dominikanische Republik','Erst prüfen, dann vertrauen.','Prüfe Glücksspiel-Domains und finde amtliche Warnungen sowie Hilfe für Verbraucher in der Dominikanischen Republik.',
'Domain prüfen','Domain oder URL','Jetzt prüfen','Die Abfrage bleibt auf deinem Gerät.',
'Warnradar','Rechtsradar','Amtliche Nachrichten','Spielerschutz','Quellen und Methodik',
'Historische Warnhinweise','Die Hinweise geben den Stand zum jeweiligen Veröffentlichungsdatum wieder. Der Status einer Domain kann sich geändert haben.',
'Amtliche Quelle','Hilfe finden','Wenn dir das Aufhören schwerfällt oder du Verlusten hinterherjagst, unterbrich das Spielen. Sprich mit einer Vertrauensperson und suche fachliche Hilfe.','Selbstausschluss beantragen','Nutze das Formular der Behörde und erkundige dich nach Geltungsbereich und Dauer.','Beschwerde einreichen','Sichere Screenshots, Daten und Zahlungsbelege. Übermittle persönliche Angaben nur über einen amtlichen Kanal.',
'Datenschutz','Diese Website übermittelt deine Abfrage nicht an den Server und speichert sie nicht. Wir nutzen keine eigenen Cookies, Webanalyse oder Werbetracker. Cloudflare hostet das Portal und kann technische Verbindungsdaten verarbeiten. Für amtliche Websites gelten deren eigene Datenschutzregeln.',
'Unabhängiges Informations- und Verbraucherschutzportal. Ohne Werbung, Affiliate-Links oder Glücksspielangebote. Rechtliche Informationen dienen der Orientierung.',
'So werten wir Daten aus','Wir vergleichen den exakten Hostnamen, einschließlich eines möglichen www-Präfixes. Ein Treffer bedeutet, dass der Hostname in der Quelle steht. Ein fehlender Treffer belegt keinen Lizenzstatus. Abfragedaten laufen nach 72 Stunden ohne gültigen Abruf ab.',
'Die verfügbaren Daten reichen für eine aktuelle Prüfung nicht aus. Frage bei der Behörde nach.',
'Amtliches Register öffnen','Gib eine Domain ein, um die verfügbaren Quellen abzugleichen.','Gib eine gültige Domain mit oder ohne https:// ein.',
'Die Domain steht in der abgerufenen Warnliste. Lass den Status von der Behörde bestätigen.',
'Die Domain steht in einem historischen Warnhinweis oder einer älteren Kopie. Der aktuelle Status muss bestätigt werden.',
'Die Quellen enthalten widersprüchliche Einträge. Kläre den Status mit der Behörde.',
'Die Domain steht im abgerufenen amtlichen Register. Kläre Geltungsbereich und Gültigkeit mit der Behörde.',
'Kein exakter Treffer in den geprüften Quellen. Daraus lässt sich keine Zulassung ableiten.',
'Älterer Datenstand. Neuere Veröffentlichungen sind möglich.','Letzter Abrufversuch','Letzter erfolgreicher Abruf','Originalveröffentlichung auf Spanisch','Verfügbar','Keine verifizierbaren Daten','Veraltete Daten','Veröffentlichungen der DGJA','Amtliches Dokument','Quelle öffnen'
],
fr: [
'Aller au contenu','République dominicaine','Vérifiez avant de faire confiance.','Vérifiez un domaine de jeux d’argent et consultez les avis officiels et les ressources de protection des consommateurs en République dominicaine.',
'Vérifier un domaine','Domaine ou URL','Vérifier','La recherche reste sur votre appareil.',
'Radar des alertes','Veille juridique','Actualités officielles','Protection des joueurs','Sources et méthode',
'Alertes historiques','Ces avis reflètent les informations publiées par l’autorité à la date indiquée. Le statut d’un domaine peut avoir changé.',
'Source officielle','Trouver de l’aide','Si vous avez du mal à arrêter ou cherchez à récupérer vos pertes, faites une pause. Parlez à une personne de confiance et cherchez une aide spécialisée.','Demander l’auto-exclusion','Consultez le formulaire de l’autorité et renseignez-vous sur sa portée et sa durée.','Déposer une plainte','Conservez les captures, les dates et les justificatifs. Transmettez vos données uniquement par un canal officiel.',
'Confidentialité','La recherche n’est ni envoyée au serveur ni enregistrée par ce site. Nous n’utilisons ni cookies internes, ni analyse d’audience, ni traceurs publicitaires. Cloudflare héberge le portail et peut traiter des données techniques de connexion. Les sites officiels ont leurs propres règles.',
'Portail indépendant d’information et de protection des consommateurs. Sans publicité, affiliation ni service de jeux. Les informations juridiques sont indicatives.',
'Comment lire les résultats','Nous comparons le nom d’hôte exact, y compris un éventuel préfixe www. Une correspondance indique que le nom figure dans la source. L’absence de résultat ne prouve aucun statut de licence. Les données expirent après 72 heures sans téléchargement valide.',
'Les données disponibles ne permettent pas de vérifier le statut actuel. Consultez l’autorité.',
'Ouvrir le registre officiel','Saisissez un domaine pour interroger les sources disponibles.','Saisissez un domaine valide, avec ou sans https://.',
'Ce domaine figure dans la liste d’alertes consultée. Confirmez son statut auprès de l’autorité.',
'Ce domaine figure dans un avis historique ou une copie plus ancienne. Son statut actuel doit être confirmé.',
'Les sources contiennent des données contradictoires. Confirmez le statut auprès de l’autorité.',
'Ce domaine figure dans le registre officiel consulté. Vérifiez sa portée et sa validité auprès de l’autorité.',
'Aucune correspondance exacte dans les sources consultées. Cela ne confirme pas une autorisation.',
'Copie ancienne. Des publications plus récentes peuvent exister.','Dernière tentative','Dernier téléchargement réussi','Publication originale en espagnol','Disponible','Pas de données vérifiables','Données anciennes','Publications de la DGJA','Document officiel','Ouvrir la source'
],
it: [
'Vai al contenuto','Repubblica Dominicana','Verifica prima di fidarti.','Controlla i domini di gioco e consulta gli avvisi ufficiali e le risorse per la tutela dei consumatori nella Repubblica Dominicana.',
'Verifica un dominio','Dominio o URL','Verifica dominio','La ricerca rimane sul tuo dispositivo.',
'Radar delle allerte','Radar normativo','Notizie ufficiali','Tutela dei giocatori','Fonti e metodologia',
'Avvisi storici','Gli avvisi riportano quanto pubblicato dall’autorità nella data indicata. Lo stato di un dominio può essere cambiato.',
'Fonte ufficiale','Cerca aiuto','Se fai fatica a smettere o cerchi di recuperare le perdite, interrompi il gioco. Parla con una persona fidata e cerca sostegno specializzato.','Richiedi l’autoesclusione','Consulta il modulo dell’autorità e informati sulla durata e sui servizi coperti.','Presenta un reclamo','Conserva schermate, date e ricevute. Invia i tuoi dati solo tramite un canale ufficiale.',
'Privacy','La ricerca non viene inviata al server né salvata dal sito. Non usiamo cookie proprietari, strumenti di analisi o tracker pubblicitari. Cloudflare ospita il sito e può trattare dati tecnici di connessione. I siti ufficiali applicano le proprie informative.',
'Portale indipendente di informazione e tutela dei consumatori. Senza pubblicità, affiliazioni o servizi di gioco. Le informazioni giuridiche hanno carattere orientativo.',
'Come interpretiamo i dati','Confrontiamo il nome host esatto, compreso un eventuale prefisso www. Una corrispondenza indica che il nome compare nella fonte. L’assenza di riscontri non prova lo stato della licenza. I dati scadono dopo 72 ore senza un download valido.',
'I dati disponibili non consentono di verificare lo stato attuale. Rivolgiti all’autorità.',
'Apri il registro ufficiale','Inserisci un dominio per consultare le fonti disponibili.','Inserisci un dominio valido, con o senza https://.',
'Il dominio compare nell’elenco di avvisi consultato. Chiedi conferma all’autorità.',
'Il dominio compare in un avviso storico o in una copia precedente. Lo stato attuale va confermato.',
'Le fonti contengono dati contrastanti. Chiedi conferma all’autorità.',
'Il dominio compare nel registro ufficiale consultato. Verifica validità e ambito con l’autorità.',
'Nessuna corrispondenza esatta nelle fonti consultate. Questo non conferma un’autorizzazione.',
'Copia precedente. Potrebbero esistere pubblicazioni più recenti.','Ultimo tentativo','Ultimo download riuscito','Pubblicazione originale in spagnolo','Disponibile','Nessun dato verificabile','Dati obsoleti','Pubblicazioni della DGJA','Documento ufficiale','Apri la fonte'
]
};

export const copy = Object.fromEntries(Object.entries(translations).map(([lang, values]) => {
  if (values.length !== keys.length) throw new Error('Incomplete translation: ' + lang);
  return [lang, Object.fromEntries(keys.map((key, index) => [key, values[index]]))];
}));

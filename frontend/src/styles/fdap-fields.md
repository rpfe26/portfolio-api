# Champs FDAP - Référence pour le Frontend

Ce document référence les champs du formulaire FDAP extraits du plugin WordPress.

## Structure des Sections

### 1. Titre de la fiche
```javascript
{
  name: "titre",
  label: "Titre de la fiche",
  type: "text",
  required: true,
  placeholder: "Ex: Montage d'une installation électrique"
}
```

### 2. 👤 Identité de l'élève
```javascript
{
  section: "Identité de l'élève",
  emoji: "👤",
  fields: [
    {
      name: "nomPrenom",
      label: "Nom / Prénom",
      type: "text",
      required: true
    },
    {
      name: "dateSaisie",
      label: "Date de saisie",
      type: "date",
      required: true
    }
  ]
}
```

### 3. 📍 Contexte de réalisation
```javascript
{
  section: "Contexte de réalisation",
  emoji: "📍",
  fields: [
    {
      name: "lieu",
      label: "Lieu",
      type: "radio",
      required: true,
      options: [
        { value: "lycee", label: "Au Lycée (Plateau technique)" },
        { value: "pfmp", label: "En Entreprise (PFMP)" }
      ]
    },
    {
      name: "enseigne",
      label: "Enseigne / Entreprise",
      type: "text",
      placeholder: "Nom de l'entreprise"
    },
    {
      name: "lieuSpecifique",
      label: "Lieu spécifique",
      type: "text",
      placeholder: "Atelier, salle, etc."
    }
  ]
}
```

### 4. 🎯 Domaine / Compétences
```javascript
{
  section: "Domaine / Compétences",
  emoji: "🎯",
  fields: [
    {
      name: "domaine",
      label: "Domaine",
      type: "text",
      placeholder: "Ex: Électrotechnique"
    },
    {
      name: "competences",
      label: "Compétences mobilisées",
      type: "textarea",
      rows: 3,
      placeholder: "Listez les compétences..."
    }
  ]
}
```

### 5. ⚙️ Conditions et ressources
```javascript
{
  section: "Conditions et ressources",
  emoji: "⚙️",
  fields: [
    {
      name: "autonomie",
      label: "Autonomie",
      type: "select",
      options: [
        { value: "1", label: "★☆☆☆☆" },
        { value: "2", label: "★★☆☆☆" },
        { value: "3", label: "★★★☆☆" },
        { value: "4", label: "★★★★☆" },
        { value: "5", label: "★★★★★" }
      ]
    },
    {
      name: "materiels",
      label: "Matériels",
      type: "text"
    },
    {
      name: "commanditaire",
      label: "Commanditaire",
      type: "text"
    },
    {
      name: "contraintes",
      label: "Contraintes",
      type: "textarea",
      rows: 2
    },
    {
      name: "consignes",
      label: "Consignes",
      type: "textarea",
      rows: 2
    }
  ]
}
```

### 6. 📝 Descriptif Détaillé
```javascript
{
  section: "Descriptif Détaillé",
  emoji: "📝",
  fields: [
    {
      name: "avecQui",
      label: "Avec qui ?",
      type: "text"
    },
    {
      name: "deroulement",
      label: "Déroulement",
      type: "textarea",
      rows: 4
    },
    {
      name: "resultats",
      label: "Résultats",
      type: "textarea",
      rows: 3
    }
  ]
}
```

### 7. 📊 Bilan Personnel
```javascript
{
  section: "Bilan Personnel",
  emoji: "📊",
  fields: [
    {
      name: "difficulte",
      label: "Difficulté",
      type: "select",
      options: "autonomie" // Même format
    },
    {
      name: "plaisir",
      label: "Plaisir",
      type: "select",
      options: "autonomie" // Même format
    },
    {
      name: "ameliorations",
      label: "Améliorations",
      type: "textarea",
      rows: 3
    }
  ]
}
```

### 8. 📷 Photos (6 max)
```javascript
{
  section: "Photos",
  emoji: "📷",
  fields: [
    {
      name: "photos",
      label: "Photos",
      type: "file",
      multiple: true,
      max: 6,
      accept: "image/*",
      compress: true,
      maxSize: 300000 // 300KB
    }
  ]
}
```

### 9. 🎬 Multimédia
```javascript
{
  section: "Multimédia",
  emoji: "🎬",
  fields: [
    {
      name: "audio",
      label: "Audio",
      type: "file",
      accept: "audio/*"
    },
    {
      name: "video",
      label: "Vidéo",
      type: "file",
      accept: "video/*"
    },
    {
      name: "fichier",
      label: "Document",
      type: "file",
      accept: ".pdf,.doc,.docx"
    }
  ]
}
```

## Variables CSS

```css
:root {
    --fdap-primary: #2563eb;
    --fdap-primary-dark: #1d4ed8;
    --fdap-accent: #10b981;
    --fdap-accent-dark: #059669;
    --fdap-bg: #f8fafc;
    --fdap-card: #ffffff;
    --fdap-border: #e2e8f0;
    --fdap-text: #1e293b;
    --fdap-text-light: #64748b;
    --fdap-radius: 16px;
    --fdap-radius-sm: 10px;
    --fdap-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
    --fdap-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    --fdap-shadow-lg: 0 10px 25px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    --fdap-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Classes CSS Principales

- `.fdap-form-container` - Conteneur principal
- `.fdap-section` - Section avec titre et icône
- `.fdap-field` - Champs de formulaire
- `.fdap-radio-group` - Groupe de radio buttons
- `.fdap-select` - Select stylisé
- `.fdap-photo-upload` - Zone d'upload photos

---

**Source** : `/fdap-plugin-minimal/includes/form-fields.php` et `assets/css/style.css`
// Traduit les messages d'erreur Supabase (renvoyés en anglais par défaut) en français.
const TRANSLATIONS = {
  'Invalid login credentials': 'Email ou mot de passe incorrect.',
  'Email not confirmed': "Votre email n'a pas encore été confirmé. Vérifiez votre boîte mail.",
  'User already registered': 'Un compte existe déjà avec cet email.',
  'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
  'Unable to validate email address: invalid format': "Format d'email invalide.",
  'Email rate limit exceeded': "Trop de tentatives. Réessayez dans quelques minutes.",
  'User not found': 'Aucun compte trouvé avec cet email.',
  'New password should be different from the old password': "Le nouveau mot de passe doit être différent de l'ancien.",
  'Signup requires a valid password': 'Veuillez saisir un mot de passe valide.',
  'Token has expired or is invalid': 'Le lien a expiré ou est invalide. Recommencez la procédure.',
}

export function translateAuthError(message) {
  if (!message) return "Une erreur est survenue. Veuillez réessayer."
  return TRANSLATIONS[message] || message
}

import { getChatGPTUser, requireChatGPTUser } from "../chatgpt-auth";

// This site-scoped OpenAI identity belongs to the requester who owns this portfolio.
// Change only if ownership of the Site changes.
const ADMIN_USER_ID = "7707952c-5fa5-4bd2-aa6c-d661cc70adc2";
const ADMIN_EMAIL = "alivahid@outlook.com";

function isOwner(user: { userId: string; email: string } | null) {
  // The Sites dispatcher has already authenticated both values. The email
  // fallback keeps the owner accessible if the platform rotates a Site-scoped
  // identity, while remaining exclusive to this one OpenAI account.
  return Boolean(user && (user.userId === ADMIN_USER_ID || user.email.toLowerCase() === ADMIN_EMAIL));
}

export async function requirePortfolioAdmin(returnTo = "/admin") {
  const user = await requireChatGPTUser(returnTo);
  return isOwner(user) ? user : null;
}

export async function isPortfolioAdmin() {
  const user = await getChatGPTUser();
  return isOwner(user);
}

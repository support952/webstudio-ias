/**
 * Service-specific questionnaire — the product type is already selected
 * in the "requested service" question, so only relevant questions appear here.
 */
export type QuestionType = "text" | "textarea" | "select" | "radio";

export interface QuestionOption {
  value: string;
  labelKey: string;
}

export interface QuestionDef {
  id: string;
  type: QuestionType;
  labelKey: string;
  placeholderKey?: string;
  options?: QuestionOption[];
  /** Always required when true */
  required?: boolean;
  /** Required only when another answer equals `value` (e.g. landing URL when "has website" is yes) */
  requiredWhen?: { id: string; value: string };
}

/** Whether this question must be answered given current answers */
export function isQuestionRequired(q: QuestionDef, answers: Record<string, string>): boolean {
  if (q.required) return true;
  if (q.requiredWhen) {
    const dep = String(answers[q.requiredWhen.id] ?? "").trim();
    return dep === q.requiredWhen.value;
  }
  return false;
}

/** Question ids that are required but still empty */
export function getMissingRequiredFieldIds(
  questions: QuestionDef[],
  answers: Record<string, string>,
): string[] {
  const missing: string[] = [];
  for (const q of questions) {
    if (!isQuestionRequired(q, answers)) continue;
    if (!String(answers[q.id] ?? "").trim()) missing.push(q.id);
  }
  return missing;
}

export type ServiceType =
  | "websites"
  | "digital_business_card"
  | "marketing_ppc";

/** Questions per service — websites, digital business card, marketing campaigns (PPC) */
export const QUESTIONNAIRE_BY_SERVICE: Record<ServiceType, QuestionDef[]> = {
  websites: [
    { id: "site_type", type: "select", labelKey: "questionnaire.websites.site_type", required: true, options: [
      { value: "landing", labelKey: "questionnaire.options.landing" },
      { value: "multi", labelKey: "questionnaire.options.multi" },
      { value: "blog", labelKey: "questionnaire.options.blog" },
    ]},
    { id: "business_name", type: "text", labelKey: "questionnaire.planning.business_name", placeholderKey: "questionnaire.planning.business_name_placeholder", required: true },
    { id: "describe_business", type: "textarea", labelKey: "questionnaire.planning.describe_business", placeholderKey: "questionnaire.planning.describe_business_placeholder", required: true },
    { id: "products_services", type: "textarea", labelKey: "questionnaire.planning.products_services", placeholderKey: "questionnaire.planning.products_services_placeholder", required: true },
    { id: "what_makes_unique", type: "textarea", labelKey: "questionnaire.planning.what_makes_unique", placeholderKey: "questionnaire.planning.what_makes_unique_placeholder" },
    { id: "existing_website_url", type: "text", labelKey: "questionnaire.planning.existing_website_url", placeholderKey: "questionnaire.planning.existing_website_url_placeholder" },
    { id: "main_purpose", type: "textarea", labelKey: "questionnaire.planning.main_purpose", placeholderKey: "questionnaire.planning.main_purpose_placeholder", required: true },
    { id: "desired_actions", type: "textarea", labelKey: "questionnaire.planning.desired_actions", placeholderKey: "questionnaire.planning.desired_actions_placeholder", required: true },
    { id: "target_audience_desc", type: "textarea", labelKey: "questionnaire.planning.target_audience_desc", placeholderKey: "questionnaire.planning.target_audience_desc_placeholder", required: true },
    { id: "b2b_b2c", type: "select", labelKey: "questionnaire.planning.b2b_b2c", required: true, options: [
      { value: "b2b", labelKey: "questionnaire.planning.b2b" },
      { value: "b2c", labelKey: "questionnaire.planning.b2c" },
      { value: "both", labelKey: "questionnaire.planning.both" },
    ]},
    { id: "required_pages", type: "textarea", labelKey: "questionnaire.planning.required_pages", placeholderKey: "questionnaire.planning.required_pages_placeholder", required: true },
    { id: "has_logo_brand", type: "radio", labelKey: "questionnaire.planning.logo_brand_guidelines", required: true, options: [
      { value: "yes", labelKey: "questionnaire.options.yes" },
      { value: "no", labelKey: "questionnaire.options.no" },
    ]},
    { id: "preferred_style", type: "select", labelKey: "questionnaire.planning.preferred_style", required: true, options: [
      { value: "modern", labelKey: "questionnaire.options.modern" },
      { value: "classic", labelKey: "questionnaire.options.classic" },
      { value: "minimal", labelKey: "questionnaire.options.minimal" },
    ]},
    { id: "preferred_colors", type: "text", labelKey: "questionnaire.planning.preferred_colors", placeholderKey: "questionnaire.planning.preferred_colors_placeholder" },
    { id: "websites_like", type: "textarea", labelKey: "questionnaire.planning.websites_like", placeholderKey: "questionnaire.planning.websites_like_placeholder" },
    { id: "business_hours", type: "text", labelKey: "questionnaire.business_hours", placeholderKey: "questionnaire.business_hours_placeholder" },
    { id: "phone", type: "text", labelKey: "questionnaire.phone", placeholderKey: "questionnaire.phone_placeholder", required: true },
    { id: "phone_2", type: "text", labelKey: "questionnaire.phone_2", placeholderKey: "questionnaire.phone_2_placeholder" },
    { id: "timeline", type: "select", labelKey: "questionnaire.timeline", required: true, options: [
      { value: "asap", labelKey: "questionnaire.options.asap" },
      { value: "1m", labelKey: "questionnaire.options.1m" },
      { value: "3m", labelKey: "questionnaire.options.3m" },
      { value: "flexible", labelKey: "questionnaire.options.flexible" },
    ]},
  ],
  digital_business_card: [
    { id: "full_name", type: "text", labelKey: "questionnaire.card.full_name", placeholderKey: "questionnaire.card.full_name_placeholder", required: true },
    { id: "role_title", type: "text", labelKey: "questionnaire.card.role_title", placeholderKey: "questionnaire.card.role_title_placeholder", required: true },
    { id: "company_name", type: "text", labelKey: "questionnaire.card.company_name", placeholderKey: "questionnaire.card.company_name_placeholder", required: true },
    { id: "industry", type: "text", labelKey: "questionnaire.card.industry", placeholderKey: "questionnaire.card.industry_placeholder", required: true },
    { id: "contact_phone", type: "text", labelKey: "questionnaire.card.contact_phone", placeholderKey: "questionnaire.card.contact_phone_placeholder", required: true },
    { id: "contact_phone_2", type: "text", labelKey: "questionnaire.card.contact_phone_2", placeholderKey: "questionnaire.card.contact_phone_2_placeholder" },
    { id: "contact_email", type: "text", labelKey: "questionnaire.card.contact_email", placeholderKey: "questionnaire.card.contact_email_placeholder", required: true },
    { id: "whatsapp", type: "text", labelKey: "questionnaire.card.whatsapp", placeholderKey: "questionnaire.card.whatsapp_placeholder" },
    { id: "has_logo", type: "radio", labelKey: "questionnaire.card.has_logo", required: true, options: [
      { value: "yes", labelKey: "questionnaire.options.yes" },
      { value: "no", labelKey: "questionnaire.options.no" },
    ]},
    { id: "preferred_style", type: "select", labelKey: "questionnaire.planning.preferred_style", required: true, options: [
      { value: "modern", labelKey: "questionnaire.options.modern" },
      { value: "classic", labelKey: "questionnaire.options.classic" },
      { value: "minimal", labelKey: "questionnaire.options.minimal" },
    ]},
    { id: "preferred_colors", type: "text", labelKey: "questionnaire.planning.preferred_colors", placeholderKey: "questionnaire.planning.preferred_colors_placeholder" },
    { id: "business_hours", type: "text", labelKey: "questionnaire.business_hours", placeholderKey: "questionnaire.business_hours_placeholder" },
    { id: "timeline", type: "select", labelKey: "questionnaire.timeline", required: true, options: [
      { value: "asap", labelKey: "questionnaire.options.asap" },
      { value: "1m", labelKey: "questionnaire.options.1m" },
      { value: "3m", labelKey: "questionnaire.options.3m" },
      { value: "flexible", labelKey: "questionnaire.options.flexible" },
    ]},
  ],
  marketing_ppc: [
    { id: "campaign_goal", type: "textarea", labelKey: "questionnaire.ppc.campaign_goal", placeholderKey: "questionnaire.ppc.campaign_goal_placeholder", required: true },
    { id: "target_audience", type: "textarea", labelKey: "questionnaire.ppc.target_audience", placeholderKey: "questionnaire.ppc.target_audience_placeholder", required: true },
    { id: "budget_range", type: "select", labelKey: "questionnaire.ppc.budget_range", required: true, options: [
      { value: "low", labelKey: "questionnaire.ppc.budget_low" },
      { value: "medium", labelKey: "questionnaire.ppc.budget_medium" },
      { value: "high", labelKey: "questionnaire.ppc.budget_high" },
    ]},
    { id: "platforms", type: "textarea", labelKey: "questionnaire.ppc.platforms", placeholderKey: "questionnaire.ppc.platforms_placeholder", required: true },
    { id: "geo_target", type: "text", labelKey: "questionnaire.ppc.geo_target", placeholderKey: "questionnaire.ppc.geo_target_placeholder", required: true },
    { id: "has_website", type: "radio", labelKey: "questionnaire.ppc.has_website", required: true, options: [
      { value: "yes", labelKey: "questionnaire.options.yes" },
      { value: "no", labelKey: "questionnaire.options.no" },
    ]},
    { id: "landing_url", type: "text", labelKey: "questionnaire.ppc.landing_url", placeholderKey: "questionnaire.ppc.landing_url_placeholder", requiredWhen: { id: "has_website", value: "yes" } },
    { id: "keywords_topics", type: "textarea", labelKey: "questionnaire.ppc.keywords_topics", placeholderKey: "questionnaire.ppc.keywords_topics_placeholder", required: true },
    { id: "phone", type: "text", labelKey: "questionnaire.phone", placeholderKey: "questionnaire.phone_placeholder", required: true },
    { id: "phone_2", type: "text", labelKey: "questionnaire.phone_2", placeholderKey: "questionnaire.phone_2_placeholder" },
    { id: "business_hours", type: "text", labelKey: "questionnaire.business_hours", placeholderKey: "questionnaire.business_hours_placeholder" },
    { id: "timeline", type: "select", labelKey: "questionnaire.timeline", required: true, options: [
      { value: "asap", labelKey: "questionnaire.options.asap" },
      { value: "1m", labelKey: "questionnaire.options.1m" },
      { value: "3m", labelKey: "questionnaire.options.3m" },
      { value: "flexible", labelKey: "questionnaire.options.flexible" },
    ]},
  ],
};

export function getQuestionsForService(service: string): QuestionDef[] {
  const key = service as ServiceType;
  return QUESTIONNAIRE_BY_SERVICE[key] ?? QUESTIONNAIRE_BY_SERVICE.websites;
}

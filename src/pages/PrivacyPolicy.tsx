import { LegalDocument, type LegalDocumentData } from "@/components/legal/LegalDocument";
import privacy from "@/content/privacy-policy.json";

const PrivacyPolicy = () => <LegalDocument doc={privacy as LegalDocumentData} />;

export default PrivacyPolicy;

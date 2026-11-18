import { LegalDocument, type LegalDocumentData } from "@/components/legal/LegalDocument";
import terms from "@/content/terms-of-service.json";

const TermsOfService = () => <LegalDocument doc={terms as LegalDocumentData} />;

export default TermsOfService;

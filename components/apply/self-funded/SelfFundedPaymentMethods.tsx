import ApplyPaymentMethodsSection, {
  type ApplyPaymentMethodsSectionProps,
} from '@/components/apply/shared/ApplyPaymentMethodsSection';

export default function SelfFundedPaymentMethodsSection({ data }: ApplyPaymentMethodsSectionProps) {
  return <ApplyPaymentMethodsSection data={data} />;
}

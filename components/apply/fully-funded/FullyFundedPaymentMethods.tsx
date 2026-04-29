import ApplyPaymentMethodsSection, {
  type ApplyPaymentMethodsSectionProps,
} from '@/components/apply/shared/ApplyPaymentMethodsSection';

export default function FullyFundedPaymentMethodsSection({ data }: ApplyPaymentMethodsSectionProps) {
  return <ApplyPaymentMethodsSection data={data} />;
}

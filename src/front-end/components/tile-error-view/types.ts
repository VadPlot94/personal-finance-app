export interface ITileErrorViewProps {
  error: Error & { digest?: string };
  retry: () => void;
}

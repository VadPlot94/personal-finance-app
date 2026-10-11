export interface IErrorViewProps {
  error: Error & { digest?: string };
  retry: () => void;
  logArea?: string;
}

export function LoadingOverlay({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[240px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

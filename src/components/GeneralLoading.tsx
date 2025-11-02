interface GeneralLoadingProps {
  loading: boolean;
}

const GeneralLoading = ({ loading }: GeneralLoadingProps) => {
  return (
    <div>
      <div className="flex items-center justify-center h-96">
        <div className="text-center flex flex-col items-center">
          {/* Logo at the top */}
          <img
            src="/image/2s.png"
            alt="Barangay RMS Logo"
            className="h-18 w-18 mb-4 rounded-full shadow-lg bg-white object-cover"
            style={{ background: "white" }}
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            {loading ? "loading..." : "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneralLoading;

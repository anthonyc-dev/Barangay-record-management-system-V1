import { OverviewSection } from "@/components/analytics/OverviewSection";

const HomePage = () => {
  return (
    <div>
      <div className="space-y-6 ">
        {/* Page Header */}
        <OverviewSection />
        {/* Calendar and Updates */}
        {/* <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingEvents ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No upcoming events scheduled.
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event, index) => (
                    <div
                      key={event.id || index}
                      className="flex items-center space-x-3 rounded-lg border border-border p-3"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          index === 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-green-500 text-white"
                        } text-sm font-medium`}
                      >
                        {formatEventDate(event.date)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatEventFullDate(event.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-500">Online</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-500">Updated</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Sync</span>
                  <span className="text-sm text-muted-foreground">
                    2 minutes ago
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;

# Booking concurrency integration checks

Run against a dedicated MySQL test server using InnoDB. The account needs permission
to create and drop databases. The runner creates a randomly named
`booking_concurrency_test_*` database and deletes only that database in cleanup.
It never reads the backend `.env` or uses the application database.

Set `TEST_MYSQL_CONNECTION_STRING` in your shell to the test server's connection
string, then run from the repository root:

```powershell
dotnet run --project Tests/BookingConcurrency
```

Checks include concurrent overlapping bookings for a doctor, a patient booking
different doctors, adjacent appointments, updating to a doctor while another
patient books, cancellation versus update, rebooking a cancelled slot, and
simultaneous bookings for a newly created guest. Each operation uses its own
DbContext and connection. Missing configuration exits with code 2 rather than
silently skipping the checks.

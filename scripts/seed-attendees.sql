-- Replace 'YOUR_EVENT_ID' with your actual event UUID
-- You can find it in the URL when viewing an event: /events/[id]

DO $$
DECLARE
  event_uuid UUID := 'YOUR_EVENT_ID'; -- ← CHANGE THIS
  names TEXT[] := ARRAY[
    'Emma Johnson', 'Liam Smith', 'Olivia Williams', 'Noah Brown', 'Ava Jones',
    'Ethan Garcia', 'Sophia Miller', 'Mason Davis', 'Isabella Rodriguez', 'Lucas Martinez',
    'Mia Anderson', 'Alexander Taylor', 'Charlotte Thomas', 'Benjamin Jackson', 'Amelia White',
    'James Harris', 'Harper Martin', 'Elijah Thompson', 'Evelyn Garcia', 'William Robinson'
  ];
  phones TEXT[] := ARRAY[
    '+1555123001', '+1555123002', '+1555123003', '+1555123004', '+1555123005',
    '+1555123006', '+1555123007', '+1555123008', '+1555123009', '+1555123010',
    '+1555123011', '+1555123012', '+1555123013', '+1555123014', '+1555123015',
    '+1555123016', '+1555123017', '+1555123018', '+1555123019', '+1555123020'
  ];
BEGIN
  FOR i IN 1..20 LOOP
    INSERT INTO attendees (event_id, full_name, phone, payment_confirmed)
    VALUES (
      event_uuid,
      names[i],
      phones[i],
      (random() > 0.5) -- Random paid/unpaid status
    );
  END LOOP;
END $$;


SELECT
    invoices.id,
    invoices.amount,
    invoices.date,
    invoices.status,
    customers.name,
    customers.email,
    customers.image_url
FROM invoices
JOIN customers ON invoices.customer_id = customers.id
WHERE
    customers.name ILIKE %aaaa%
    OR customers.email ILIKE '%aaaa%'
    OR invoices.amount::text ILIKE '%aaaa%'
    OR invoices.date::text ILIKE '%aaaa%'
    OR invoices.status ILIKE '%aaaa%'
ORDER BY invoices.date DESC
LIMIT 10 OFFSET 0
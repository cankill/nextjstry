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
    customers.name ILIKE '%a%'
    OR customers.email ILIKE '%a%'
    OR invoices.amount::text ILIKE '%a%'
    OR invoices.date::text ILIKE '%a%'
    OR invoices.status ILIKE '%a%'
ORDER BY invoices.date DESC
LIMIT 10 OFFSET 0
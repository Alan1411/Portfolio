-- Sample data for your portfolio

-- Projects
INSERT INTO projects (title, description, tech_stack, repo_url, demo_url, featured, sort_order) VALUES
('Portfolio Website', 'This portfolio site built with Node.js, Express, and Supabase.', ARRAY['Node.js', 'Express', 'Supabase', 'EJS'], 'https://github.com/Alan1411/Portfolio', 'https://chicoweb.de', true, 1),
('Web UI Agent', 'AI-powered browser automation tool built with Python and Gradio.', ARRAY['Python', 'Gradio', 'LangChain', 'Browser-Use'], 'https://github.com/Alan1411', null, false, 2);

-- Skills
INSERT INTO skills (name, category, icon, proficiency, sort_order) VALUES
-- Backend
('Node.js', 'Backend', '🟢', 4, 1),
('Express.js', 'Backend', '🚀', 4, 2),
('Python', 'Backend', '🐍', 3, 3),
-- Database
('Supabase', 'Database', '⚡', 4, 1),
('PostgreSQL', 'Database', '🐘', 3, 2),
-- Frontend
('HTML/CSS', 'Frontend', '🎨', 4, 1),
('JavaScript', 'Frontend', '📜', 4, 2),
('EJS', 'Frontend', '📄', 3, 3),
-- Tools
('Git', 'Tools', '🔀', 4, 1),
('Vercel', 'Tools', '▲', 4, 2),
('Docker', 'Tools', '🐳', 2, 3);

-- Blog post
INSERT INTO blog_posts (title, slug, content, excerpt, published) VALUES
(
  'Building My Portfolio with Node.js and Supabase',
  'building-my-portfolio',
  'I built this portfolio website from scratch using Node.js, Express, and Supabase as the backend.

The stack is simple but powerful:
- Express handles routing and server-side rendering with EJS
- Supabase provides the database, auth, and storage
- Vercel deploys it serverlessly

The contact form sends emails through AgentMail, so messages land directly in my inbox.

This project taught me a lot about building full-stack applications without a heavy frontend framework. Sometimes, vanilla JS is all you need.',
  'How I built this portfolio from scratch with Node.js, Express, and Supabase.',
  true
);

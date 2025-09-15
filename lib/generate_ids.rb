require 'securerandom'

Dir.glob("_posts/*.md") do |file|
  content = File.read(file)
  unless content =~ /unique_id:/
    unique_id = SecureRandom.hex(4) # Generates a 8-character hex ID (e.g., "a1b2c3d4")
    new_content = content.sub(/^---\n/, "---\nunique_id: #{unique_id}\n")
    File.write(file, new_content)
  end
end

Dir.glob("*.md") do |file| # For pages
  content = File.read(file)
  unless content =~ /unique_id:/ || File.basename(file) == "_config.yml"
    unique_id = SecureRandom.hex(4)
    new_content = content.sub(/^---\n/, "---\nunique_id: #{unique_id}\n")
    File.write(file, new_content)
  end
end

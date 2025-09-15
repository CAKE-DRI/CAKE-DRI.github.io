require 'securerandom'

Dir.glob("_landscape-ecse-gpu/*.md") do |file|
  content = File.read(file)
  unless content =~ /unique_id:/
    unique_id = SecureRandom.random_number(10000).to_i # Generates a 8-character hex ID (e.g., "a1b2c3d4")
    new_content = content.sub(/^---\n/, "---\nunique_id: #{random_id}\n")
    File.write(file, new_content)
  end
end

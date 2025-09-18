import os
import glob

# Get the directory where your files are
directory = input("Enter the path to your files (or press Enter for current directory): ").strip()
if not directory:
    directory = "."  # Current directory if nothing entered

# Get all files in the directory
files = glob.glob(os.path.join(directory, "*"))

renamed_count = 0
skipped_count = 0

for file_path in files:
    # Skip if it's a directory
    if os.path.isdir(file_path):
        continue
    
    # Get just the filename part
    old_name = os.path.basename(file_path)
    
    # Check if there's an underscore in the name
    if "_" in old_name:
        # Split by underscore and keep everything after it
        new_name = old_name.split("_", 1)[1]  # The 1 means "split only at the first underscore"
        
        # Build the full paths
        old_path = file_path
        new_path = os.path.join(directory, new_name)
        
        # Check if a file with the new name already exists
        if os.path.exists(new_path):
            print(f"⚠️  Skipping {old_name} -> {new_name} (file already exists)")
            skipped_count += 1
        else:
            # Do the rename
            os.rename(old_path, new_path)
            print(f"✅ Renamed: {old_name} -> {new_name}")
            renamed_count += 1
    else:
        print(f"⏭️  Skipping {old_name} (no underscore found)")
        skipped_count += 1

print(f"\n🎉 Done! Renamed {renamed_count} files, skipped {skipped_count}")
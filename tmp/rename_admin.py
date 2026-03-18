import os

def replace_in_files(directory, old_str, new_str):
    for root, dirs, files in os.walk(directory):
        if any(x in root for x in ['node_modules', '.next', '.git']):
            continue
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.json', '.md')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    if old_str in content:
                        new_content = content.replace(old_str, new_str)
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {path}")
                except Exception:
                    pass

replace_in_files('.', '@/components/admin', '@/components/2tact')
replace_in_files('.', '@/app/admin', '@/app/2tact')

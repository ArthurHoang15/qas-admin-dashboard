/**
 * Remove Vietnamese diacritics from a string.
 * Used to create safe filenames for PDF attachments.
 *
 * Example: "Nguyễn Văn Anh" → "Nguyen Van Anh"
 */
export function removeDiacritics(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove combining diacritical marks
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/\s+/g, "_"); // Replace spaces with underscores for filenames
}

export function printRupiah(nominal: string | number) {
  return 'Rp. ' + nominal.toLocaleString('id')
}

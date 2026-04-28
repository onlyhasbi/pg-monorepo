export const info = {
  nasabah: 2.4,
  cabang: {
    malaysia: 21,
    indonesia: 7,
    get total() {
      return this.malaysia + this.indonesia;
    },
  },
  negara: 5,
  tahunBeroperasi: String(new Date().getFullYear() - 2008),
};

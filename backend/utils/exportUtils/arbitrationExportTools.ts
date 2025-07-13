import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

i18next.use(Backend).init({
  lng: 'en',
  backend: {
    loadPath: './locales/{{lng}}/{{ns}}.json'
  }
});

export class ArbitrationExportTools {
  static async exportArbitration(data: any): Promise<string> {
    return i18next.t('arbitration.export', data);
  }
}

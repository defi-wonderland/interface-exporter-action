import { expect } from 'chai';
import { createReadmeAndLicense } from '../../src/createReadmeAndLicense';
import fse from 'fs-extra';
import { ExportType } from '../../src/constants';

describe('createReadmeAndLicense', () => {
  const exportDir = './test/tmp';

  beforeEach(() => {
    fse.removeSync(exportDir);
  });

  afterEach(() => {
    fse.removeSync(exportDir);
  });

  it('should create abi README.MD file with correct package name', () => {
    const packageName = 'test-package';
    createReadmeAndLicense(packageName, ExportType.INTERFACES, exportDir);

    const readmePath = `${exportDir}/README.MD`;
    expect(fse.existsSync(readmePath)).to.be.true;

    const readmeContent = fse.readFileSync(readmePath, 'utf8');
    expect(readmeContent).to.include(`# ${packageName}`);
  });

  it('should create ethers v6 README.MD file with correct package name', () => {
    const packageName = 'test-package';
    createReadmeAndLicense(packageName, ExportType.INTERFACES, exportDir);

    const readmePath = `${exportDir}/README.MD`;
    expect(fse.existsSync(readmePath)).to.be.true;

    const readmeContent = fse.readFileSync(readmePath, 'utf8');
    expect(readmeContent).to.include(`# ${packageName}`);
  });

  it('should create web3 README.MD file with correct package name', () => {
    const packageName = 'test-package';
    createReadmeAndLicense(packageName, ExportType.CONTRACTS, exportDir);

    const readmePath = `${exportDir}/README.MD`;
    expect(fse.existsSync(readmePath)).to.be.true;

    const readmeContent = fse.readFileSync(readmePath, 'utf8');
    expect(readmeContent).to.include(`# ${packageName}`);
  });

  it('should create LICENSE file if it exists', () => {
    const packageName = 'test-package';
    createReadmeAndLicense(packageName, ExportType.CONTRACTS, exportDir);

    const licenseFilePath = `${exportDir}/LICENSE`;
    expect(fse.existsSync(licenseFilePath)).to.be.true;
  });
});

import fse from 'fs-extra';
import { execSync } from 'child_process';
import { copySolidityFiles } from './copySolidityFiles';
import { PackageJson } from './types';
import { createReadmeAndLicense } from './createReadmeAndLicense';
import { parseGitmodulesDependencies } from './parseGitmodulesDependencies';
import { ExportType } from './constants';

export const createPackage = (
  outDir: string,
  interfacesDir: string,
  contractsDir: string,
  librariesDir: string,
  packageName: string,
  exportType: ExportType,
) => {
  const exportName = exportType === ExportType.INTERFACES ? '-interfaces' : '';
  // Empty export destination directory
  const packageFullName = `${packageName}${exportName}`;
  const destinationDir = `export/${packageFullName}`;
  fse.emptyDirSync(destinationDir);

  console.log('Installing dependencies');
  execSync('yarn');

  // Read and copy the input package.json
  const inputPackageJson = fse.readJsonSync('./package.json');
  if (!inputPackageJson) throw new Error('package.json not found');
  const gitDependencies = parseGitmodulesDependencies();
  // Create custom package.json in the export directory
  const packageJson: PackageJson = {
    name: packageFullName,
    version: inputPackageJson.version,
    dependencies: {
      ...inputPackageJson.dependencies,
      ...gitDependencies,
    },
  };
  fse.writeJsonSync(`${destinationDir}/package.json`, packageJson, { spaces: 4 });

  // Copy the interfaces and their ABIs
  copySolidityFiles(outDir, interfacesDir, destinationDir);

  // Copy the contracts and libraries only if the export type is all
  if (exportType === ExportType.ALL) {
    if (contractsDir != '') copySolidityFiles(outDir, contractsDir, destinationDir);
    if (librariesDir != '') copySolidityFiles(outDir, librariesDir, destinationDir);
  }

  createReadmeAndLicense(packageJson.name, exportType, destinationDir);
  console.log(`Created README and LICENSE`);

  // Install package dependencies
  console.log(`Installing dependencies`);
  execSync(`cd ${destinationDir} && yarn`);
};

const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../src/data/articles.ts');
let content = fs.readFileSync(articlesPath, 'utf8');

const replacements = [
  // 1. how-to-remove-duplicates-in-excel -> excel-drop-down-list & how-to-add-bullet-points-in-excel
  {
    search: `To ensure Excel keeps the newest entry, sort your dataset by date or order ID in <strong>Descending Order (Newest to Oldest)</strong> before pressing <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt + A + M</kbd>. This positions your freshest data at the top, guaranteeing that Excel preserves the correct record while purging historical duplicates.
</p>`,
    replace: `To ensure Excel keeps the newest entry, sort your dataset by date or order ID in <strong>Descending Order (Newest to Oldest)</strong> before pressing <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt + A + M</kbd>. This positions your freshest data at the top, guaranteeing that Excel preserves the correct record while purging historical duplicates.
</p>
<p class="text-slate-700 leading-relaxed mb-6">
  Once your dataset is scrubbed of redundant records, maintaining data integrity requires preventing future typographical errors at the entry point. A proven best practice is standardizing user input with an <a href="/articles/excel-drop-down-list" class="text-blue-600 font-medium hover:underline">Excel drop-down list</a>, which restricts input cells to verified items. For executive dashboards and status summaries derived from cleaned unique rows, you can also format your records clearly by learning <a href="/articles/how-to-add-bullet-points-in-excel" class="text-blue-600 font-medium hover:underline">how to add bullet points in Excel</a> for organized single-cell notes.
</p>`
  },

  // 2. aws-ec2-instance-types-explained -> docker-container-architecture & linux-file-permissions-chmod-chown
  {
    search: `<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Web Application Frontends and API Gateways</h3>
<p class="text-slate-700 leading-relaxed mb-4">
  Deploy containerized web services across stateless Auto Scaling groups. Rather than creating a single massive host, launch multiple smaller nodes like <code>c7g.large</code> across at least three distinct Availability Zones. This design provides resilience against zone failures and allows granular scaling during sudden user spikes.
</p>`,
    replace: `<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Web Application Frontends and API Gateways</h3>
<p class="text-slate-700 leading-relaxed mb-4">
  Deploy containerized web services across stateless Auto Scaling groups. When sizing virtual machines for container hosts, understanding <a href="/articles/docker-container-architecture" class="text-blue-600 font-medium hover:underline">Docker container architecture</a> ensures your host OS kernel and cgroup memory limits align with your chosen EC2 vCPU footprint. Rather than creating a single massive host, launch multiple smaller nodes like <code>c7g.large</code> across at least three distinct Availability Zones. This design provides resilience against zone failures and allows granular scaling during sudden user spikes.
</p>`
  },
  {
    search: `  This command outputs a clean tabular summary showing instance designations, RAM capacity in megabytes, CPU core counts, and confirmed network bandwidth limits.
</p>`,
    replace: `  This command outputs a clean tabular summary showing instance designations, RAM capacity in megabytes, CPU core counts, and confirmed network bandwidth limits. When connecting to newly launched Linux instances via SSH key pairs, remember to configure proper <a href="/articles/linux-file-permissions-chmod-chown" class="text-blue-600 font-medium hover:underline">Linux file permissions with chmod and chown</a> on your private keys to prevent client authentication errors.
</p>`
  },

  // 3. why-is-chatgpt-so-slow -> chatgpt-file-upload-limits
  {
    search: `<p class="text-slate-700 leading-relaxed mb-6">
  If your thread contains thirty previous exchanges with extensive code blocks or pasted logs, the server must ingest 25,000 tokens before calculating its first output word. This massive prefill stage dramatically increases Time to First Token and heightens the likelihood of request timeouts.
</p>`,
    replace: `<p class="text-slate-700 leading-relaxed mb-6">
  If your thread contains thirty previous exchanges with extensive code blocks or pasted logs, the server must ingest 25,000 tokens before calculating its first output word. This massive prefill stage dramatically increases Time to First Token and heightens the likelihood of request timeouts. The processing delay escalates further when users attach complex documents or spreadsheets; checking <a href="/articles/chatgpt-file-upload-limits" class="text-blue-600 font-medium hover:underline">ChatGPT file upload limits and token restrictions</a> helps prevent unexpected session freezes and gateway timeouts.
</p>`
  },

  // 4. windows-11-pro-vs-home -> windows-server-2019-end-of-life & docker-container-architecture
  {
    search: `  <li><strong>Domain Join and Entra ID:</strong> Pro machines can join classic on-premise Windows Server Active Directory domains as well as cloud-native Microsoft Entra ID environments. This enables centralized single sign-on (SSO), automated BitLocker key escrow, and dynamic policy synchronization via Microsoft Intune.</li>`,
    replace: `  <li><strong>Domain Join and Entra ID:</strong> Pro machines can join classic on-premise Windows Server Active Directory domains as well as cloud-native Microsoft Entra ID environments. As enterprise IT teams overhaul directory infrastructure to maintain security compliance ahead of the <a href="/articles/windows-server-2019-end-of-life" class="text-blue-600 font-medium hover:underline">Windows Server 2019 end of life</a> deadline, Pro workstations are mandatory for centralized group policy enforcement.</li>`
  },
  {
    search: `<p class="text-slate-700 leading-relaxed mb-4">
  However, developers who run containerized workflows via Docker Desktop or Podman encounter practical friction on Windows 11 Home:
</p>`,
    replace: `<p class="text-slate-700 leading-relaxed mb-4">
  However, developers who run containerized workflows via Docker Desktop or Podman encounter practical friction on Windows 11 Home. Reviewing the fundamental mechanisms in <a href="/articles/docker-container-architecture" class="text-blue-600 font-medium hover:underline">Docker container architecture</a> illustrates why native Hyper-V virtualization and custom virtual network switches in Windows 11 Pro deliver superior container stability:
</p>`
  },

  // 5. linux-file-permissions-chmod-chown -> aws-ec2-instance-types-explained & docker-container-architecture
  {
    search: `# Lock down an SSH key so OpenSSH client allows authentication
chmod 600 ~/.ssh/id_ed25519

# Set public web server permissions on an HTML document`,
    replace: `# Lock down an SSH key so OpenSSH client allows authentication
chmod 600 ~/.ssh/id_ed25519</code></pre>
<p class="text-slate-700 leading-relaxed mb-4">
  Restricting private key permissions to <code>600</code> is an absolute requirement when connecting to remote cloud servers across <a href="/articles/aws-ec2-instance-types-explained" class="text-blue-600 font-medium hover:underline">AWS EC2 instance types</a>, where SSH daemons automatically reject overly permissive key files.
</p>
<pre><code># Set public web server permissions on an HTML document`
  },
  {
    search: `<p class="text-slate-700 leading-relaxed mb-6">
  On distributions like RHEL, CentOS, AlmaLinux, or Ubuntu, mandatory access control systems can block file operations despite valid POSIX permissions. Check audit logs with <code>sudo ausearch -m avc -ts recent</code> or temporarily check SELinux mode with <code>getenforce</code>. Restore default file contexts using <code>restorecon -Rv /var/www/html</code>.
</p>`,
    replace: `<p class="text-slate-700 leading-relaxed mb-6">
  On distributions like RHEL, CentOS, AlmaLinux, or Ubuntu, mandatory access control systems can block file operations despite valid POSIX permissions. Check audit logs with <code>sudo ausearch -m avc -ts recent</code> or temporarily check SELinux mode with <code>getenforce</code>. Restore default file contexts using <code>restorecon -Rv /var/www/html</code>. These permission models are equally critical when configuring volume mounts in <a href="/articles/docker-container-architecture" class="text-blue-600 font-medium hover:underline">Docker container architecture</a>, where host UID and GID mapping issues frequently trigger permission denied errors.
</p>`
  },

  // 6. excel-drop-down-list -> how-to-remove-duplicates-in-excel & how-to-add-bullet-points-in-excel
  {
    search: `<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">6. Fixing Spaces in Dependent Cascading Drop-Downs</h3>
<p class="text-slate-700 leading-relaxed mb-6">
  When creating dependent drop-downs with <code>=INDIRECT(A2)</code>, Excel Named Ranges cannot contain spaces. If cell A2 contains "United States", the formula fails with <code>#REF!</code>. Fix this by defining named ranges with underscores (<code>United_States</code>) and configuring your Data Validation formula as <code>=INDIRECT(SUBSTITUTE(A2, " ", "_"))</code>.
</p>`,
    replace: `<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">6. Fixing Spaces in Dependent Cascading Drop-Downs</h3>
<p class="text-slate-700 leading-relaxed mb-6">
  When creating dependent drop-downs with <code>=INDIRECT(A2)</code>, Excel Named Ranges cannot contain spaces. If cell A2 contains "United States", the formula fails with <code>#REF!</code>. Fix this by defining named ranges with underscores (<code>United_States</code>) and configuring your Data Validation formula as <code>=INDIRECT(SUBSTITUTE(A2, " ", "_"))</code>.
</p>
<p class="text-slate-700 leading-relaxed mb-6">
  Before finalizing dropdown source lists, always audit your master tables to <a href="/articles/how-to-remove-duplicates-in-excel" class="text-blue-600 font-medium hover:underline">remove duplicates in Excel</a> so choices stay compact and uncluttered. Additionally, if your spreadsheet combines input selectors with itemized descriptions, learn <a href="/articles/how-to-add-bullet-points-in-excel" class="text-blue-600 font-medium hover:underline">how to add bullet points in Excel</a> to structure multi-row checklist notes effectively.
</p>`
  },

  // 7. docker-container-architecture -> linux-file-permissions-chmod-chown & aws-ec2-instance-types-explained
  {
    search: `<td>Direct access to host directory; relies on host filesystem permissions (UID/GID)</td>`,
    replace: `<td>Direct access to host directory; relies on host filesystem permissions (UID/GID). Configuring <a href="/articles/linux-file-permissions-chmod-chown" class="text-blue-600 font-medium hover:underline">Linux file permissions with chmod and chown</a> on host directories prevents permission errors when unprivileged container processes write to mounted storage.</td>`
  },
  {
    search: `<p class="text-slate-700 leading-relaxed mb-4">
  An exit code of 137 indicates the container received signal 9 (SIGKILL). If <code>OOMKilled</code> displays <code>true</code>, the process exceeded its cgroup memory quota. Increase memory allocation or optimize application garbage collection parameters.
</p>`,
    replace: `<p class="text-slate-700 leading-relaxed mb-4">
  An exit code of 137 indicates the container received signal 9 (SIGKILL). If <code>OOMKilled</code> displays <code>true</code>, the process exceeded its cgroup memory quota. Increase memory allocation or optimize application garbage collection parameters. When hosting containers in cloud datacenters, evaluating <a href="/articles/aws-ec2-instance-types-explained" class="text-blue-600 font-medium hover:underline">AWS EC2 instance types</a> ensures your virtual machines provide adequate RAM head-room and burstable bandwidth for container clusters.
</p>`
  },

  // 8. chatgpt-file-upload-limits -> why-is-chatgpt-so-slow
  {
    search: `<p class="text-slate-700 leading-relaxed mb-6">
  Uploading a 400 MB file over an unstable wireless connection frequently triggers silent HTTP chunk dropouts. If an upload hangs at 99%, compress the document into a standard ZIP archive before uploading, or switch to an Ethernet connection.
</p>`,
    replace: `<p class="text-slate-700 leading-relaxed mb-6">
  Uploading a 400 MB file over an unstable wireless connection frequently triggers silent HTTP chunk dropouts. If an upload hangs at 99%, compress the document into a standard ZIP archive before uploading, or switch to an Ethernet connection. Furthermore, massive file uploads dramatically bloat the conversational context window; if your prompts experience extreme response delays after processing attachments, examine the system factors explaining <a href="/articles/why-is-chatgpt-so-slow" class="text-blue-600 font-medium hover:underline">why ChatGPT is so slow during peak hours</a>.
</p>`
  },

  // 9. windows-server-2019-end-of-life -> windows-11-pro-vs-home & aws-ec2-instance-types-explained
  {
    search: `<p class="text-slate-700 leading-relaxed mb-6">
  Once the role transfer finishes, point workstation DHCP scopes to the new DC DNS address. After a two-week monitoring period, run the Active Directory Domain Services Configuration Wizard on the old Server 2019 box to cleanly demote it and retire the VM.
</p>`,
    replace: `<p class="text-slate-700 leading-relaxed mb-6">
  Once the role transfer finishes, point workstation DHCP scopes to the new DC DNS address. When connecting client workstations to refreshed domain controllers, ensure endpoints run compatible operating system editions; as detailed in our guide on <a href="/articles/windows-11-pro-vs-home" class="text-blue-600 font-medium hover:underline">Windows 11 Pro vs Home</a>, Pro editions are mandatory to support domain joining and centralized Group Policy management.
</p>`
  },
  {
    search: `<p class="text-slate-700 leading-relaxed mb-6">
  Organizations can connect their on-premise servers to <strong>Azure Arc</strong> to purchase ESUs on a flexible monthly subscription model, or migrate workloads into Azure virtual machines where Extended Security Updates are provided without additional licensing surcharges. Planning migrations today avoids these expensive bridge fees.
</p>`,
    replace: `<p class="text-slate-700 leading-relaxed mb-6">
  Organizations can connect their on-premise servers to <strong>Azure Arc</strong> to purchase ESUs on a flexible monthly subscription model, or migrate workloads into Azure virtual machines where Extended Security Updates are provided without additional licensing surcharges. For teams considering cloud migrations, comparing <a href="/articles/aws-ec2-instance-types-explained" class="text-blue-600 font-medium hover:underline">AWS EC2 instance types</a> provides a practical roadmap for mapping on-premise vCPU and memory specifications into scalable cloud compute.
</p>`
  },

  // 10. how-to-add-bullet-points-in-excel -> excel-drop-down-list & how-to-remove-duplicates-in-excel
  {
    search: `<p class="text-slate-700 leading-relaxed mb-6">
  If you type a bullet symbol directly into a numeric cell (such as <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">• 450</code>), Excel converts that cell into a text string. Any <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">SUM</code>, <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">AVERAGE</code>, or arithmetic formulas referencing it will return a <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">#VALUE!</code> error. To display bullets alongside numbers without breaking calculations, apply Custom Formatting using the format code <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">• General</code>.
</p>`,
    replace: `<p class="text-slate-700 leading-relaxed mb-6">
  If you type a bullet symbol directly into a numeric cell (such as <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">• 450</code>), Excel converts that cell into a text string. Any <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">SUM</code>, <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">AVERAGE</code>, or arithmetic formulas referencing it will return a <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">#VALUE!</code> error. To display bullets alongside numbers without breaking calculations, apply Custom Formatting using the format code <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">• General</code>.
</p>
<p class="text-slate-700 leading-relaxed mb-6">
  When assembling comprehensive workbooks, pairing formatted notes with validated input controls ensures consistency across team spreadsheets. You can combine bulleted summary items with an <a href="/articles/excel-drop-down-list" class="text-blue-600 font-medium hover:underline">Excel drop-down list</a> for structured status tracking. If you are importing disparate lists from external sources, remember to <a href="/articles/how-to-remove-duplicates-in-excel" class="text-blue-600 font-medium hover:underline">remove duplicates in Excel</a> first to maintain clean, reliable data tables.
</p>`
  }
];

let appliedCount = 0;
for (let i = 0; i < replacements.length; i++) {
  const { search, replace } = replacements[i];
  // Normalize Windows CRLF and LF to match
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedSearch = search.replace(/\r\n/g, '\n');

  if (normalizedContent.includes(normalizedSearch)) {
    content = normalizedContent.replace(normalizedSearch, replace.replace(/\r\n/g, '\n'));
    appliedCount++;
    console.log(`[PASS] Applied contextual link set #${i + 1}`);
  } else {
    console.error(`[FAIL] Could not find target pattern for set #${i + 1}`);
  }
}

console.log(`\nResult: Successfully applied ${appliedCount} of ${replacements.length} contextual link sets.`);

if (appliedCount === replacements.length) {
  fs.writeFileSync(articlesPath, content, 'utf8');
  console.log('[SUCCESS] src/data/articles.ts updated with full in-text contextual internal linking!');
} else {
  console.error('[ERROR] Some patterns did not match. Aborting write.');
  process.exit(1);
}

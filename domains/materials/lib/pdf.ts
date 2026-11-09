/** PDF 모듈은 브라우저에서만 불러와 서버의 DOM 의존성을 피한다. */
export async function loadPdfEngine() {
  const pdf = await import('pdfjs-dist');

  pdf.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();

  return pdf;
}

/** PDF 텍스트를 실제 페이지 순서로 추출하며 스캔본에 OCR 결과를 만들지 않는다. */
export async function extractPdf(
  file: File,
  onProgress: (page: number, total: number) => void
) {
  if (file.size > 10 * 1024 * 1024)
    throw new Error('PDF는 10MB 이하로 등록해 주세요.');

  const engine = await loadPdfEngine();

  const task = engine.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    useSystemFonts: true,
  });

  try {
    const document = await task.promise;

    if (document.numPages > 200)
      throw new Error('PDF는 200페이지 이하로 등록해 주세요.');

    const pages: string[] = [];
    let totalCharacters = 0;

    for (let number = 1; number <= document.numPages; number++) {
      const page = await document.getPage(number);
      const content = await page.getTextContent();

      const text = content.items
        .map((item) =>
          'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : ''
        )
        .join('')
        .trim();

      if (text.length > 50000)
        throw new Error(
          `${number}페이지의 텍스트가 너무 많습니다. 자료를 나누어 등록해 주세요.`
        );
      totalCharacters += text.length;
      if (totalCharacters > 2000000)
        throw new Error(
          '추출한 전체 텍스트가 너무 많습니다. PDF를 나누어 등록해 주세요.'
        );
      pages.push(text);
      onProgress(number, document.numPages);
    }

    return pages;
  } catch (error) {
    if (error instanceof Error && error.name === 'PasswordException')
      throw new Error(
        '암호가 설정된 PDF는 등록할 수 없습니다. 암호를 해제한 파일을 사용해 주세요.'
      );
    if (
      error instanceof Error &&
      ['InvalidPDFException', 'MissingPDFException'].includes(error.name)
    )
      throw new Error(
        'PDF 원본을 읽지 못했습니다. 파일이 손상되지 않았는지 확인해 주세요.'
      );
    throw error;
  } finally {
    await task.destroy();
  }
}

/** 바이너리 원본을 손상시키지 않고 JSON 전송용 base64로 변환한다. */
export const encodePdf = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== 'string')
        return reject(new Error('PDF 파일을 읽지 못했습니다.'));
      resolve(result.slice(result.indexOf(',') + 1));
    };

    reader.onerror = () => reject(new Error('PDF 파일을 읽지 못했습니다.'));
    reader.readAsDataURL(file);
  });

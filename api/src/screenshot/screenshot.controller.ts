// src/screenshot/screenshot.controller.ts
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ScreenshotService } from './screenshot.service';

@Controller('api/screenshot')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) {}

  @Get()
  async captureScreenshot(
    @Query('url') url: string,
    @Query('size') size: string,
    @Query('script') script: string,
  ): Promise<{ screenshot: string }> {
    const screenshot = await this.screenshotService.captureScreenshot(url, size, script);
    return { screenshot };
  }
}

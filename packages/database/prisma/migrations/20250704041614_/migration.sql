/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `DataStream` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DataStream_title_key" ON "DataStream"("title");

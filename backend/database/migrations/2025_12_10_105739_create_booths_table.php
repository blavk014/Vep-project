<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
         Schema::create('booths', function (Blueprint $table) {
        $table->id();
        $table->foreignId('exhibitor_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->string('video_url')->nullable();
        $table->text('info')->nullable();
        $table->string('brochure')->nullable(); // PDF file
        $table->timestamps();
         });
    }

    public function down(): void
    {
        Schema::dropIfExists('booths');
    }
};

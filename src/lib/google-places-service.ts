export class GooglePlacesService {
  private apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  async searchNomadFriendlyPlaces(city: string, lat: number, lng: number) {
    const places = [];
    
    // 搜索不同类型的 nomad 友好地点
    const categories = [
      'cafe',           // 咖啡馆
      'restaurant',     // 餐厅
      'lodging',        // 住宿
      'establishment'   // 其他场所
    ];
    
    for (const category of categories) {
      try {
        const results = await this.searchNearbyPlaces(lat, lng, category);
        const nomadPlaces = this.filterNomadFriendly(results.results || []);
        places.push(...nomadPlaces);
      } catch (error) {
        console.error(`Error searching ${category}:`, error);
      }
    }
    
    return this.formatForDisplay(places);
  }
  
  private async searchNearbyPlaces(lat: number, lng: number, type: string) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${lat},${lng}&radius=2000&type=${type}&key=${this.apiKey}`
    );
    return response.json();
  }
  
  private filterNomadFriendly(places: any[]) {
    // 过滤出可能对 nomad 友好的地点
    return places.filter(place => {
      const name = place.name.toLowerCase();
      const types = place.types || [];
      
      // 关键词匹配
      const nomadKeywords = [
        'cafe', 'coffee', 'starbucks', 'blue bottle', 'wework', 'coworking',
        'hostel', 'guesthouse', 'park', 'library', 'university', 'nomad'
      ];
      
      return nomadKeywords.some(keyword => 
        name.includes(keyword) || types.includes(keyword)
      );
    });
  }
  
  private formatForDisplay(places: any[]) {
    return places.map(place => ({
      id: `google_${place.place_id}`,
      name: place.name,
      category: this.determineCategory(place),
      city_id: 'osaka', // 默认城市，实际使用时应该传入
      address: place.vicinity || place.formatted_address || 'Address not available',
      latitude: place.geometry?.location?.lat || 0,
      longitude: place.geometry?.location?.lng || 0,
      description: this.generateDescription(place),
      tags: this.generateTags(place),
      wifi_speed: this.estimateWifiSpeed(place),
      price_level: this.getPriceLevel(place.price_level),
      noise_level: this.estimateNoiseLevel(place),
      social_atmosphere: this.estimateSocialAtmosphere(place),
      submitted_by: 'Google Places',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rating: place.rating || 0,
      review_count: place.user_ratings_total || 0,
      upvotes: Math.floor(Math.random() * 50) + 10,
      downvotes: Math.floor(Math.random() * 5),
      isFromGoogle: true
    }));
  }
  
  private determineCategory(place: any): string {
    const name = place.name.toLowerCase();
    const types = place.types || [];
    
    // 联合办公空间
    if (name.includes('wework') || name.includes('coworking') || types.includes('establishment')) return 'coworking';
    
    // 咖啡馆
    if (name.includes('starbucks') || name.includes('coffee') || name.includes('cafe')) return 'cafe';
    
    // 住宿类型
    if (name.includes('hostel') || name.includes('backpacker')) return 'hostel';
    if (name.includes('hotel') || name.includes('inn')) return 'hotel';
    if (name.includes('coliving') || name.includes('nomad')) return 'coliving';
    
    // 餐厅
    if (types.includes('restaurant') || types.includes('food')) return 'restaurant';
    
    // 图书馆
    if (name.includes('library') || types.includes('library')) return 'library';
    
    // 公园
    if (name.includes('park') || types.includes('park')) return 'park';
    
    // 大学
    if (name.includes('university') || name.includes('college') || types.includes('university')) return 'university';
    
    // 购物中心
    if (name.includes('mall') || name.includes('shopping') || types.includes('shopping_mall')) return 'shopping';
    
    // 根据 Google Places 类型判断
    if (types.includes('lodging')) return 'hotel';
    if (types.includes('park')) return 'park';
    if (types.includes('library')) return 'library';
    if (types.includes('university')) return 'university';
    if (types.includes('shopping_mall')) return 'shopping';
    
    return 'other';
  }
  
  private generateDescription(place: any): string {
    const name = place.name.toLowerCase();
    const rating = place.rating || 0;
    
    if (name.includes('wework')) {
      return '专业的联合办公空间，设施齐全，社区氛围很好。';
    }
    if (name.includes('starbucks')) {
      return '连锁咖啡店，WiFi稳定，座位充足，适合工作。';
    }
    if (name.includes('blue bottle')) {
      return '环境安静，WiFi稳定，咖啡品质很好，适合长时间工作。';
    }
    if (name.includes('nomad')) {
      return '数字游民专用住宿，价格合理，位置便利，社交氛围浓厚。';
    }
    if (rating >= 4.5) {
      return '评价很高的地方，环境舒适，适合数字游民工作。';
    }
    return '适合工作和放松的地方。';
  }
  
  private generateTags(place: any): string[] {
    const tags = [];
    const name = place.name.toLowerCase();
    const rating = place.rating || 0;
    
    if (rating >= 4.5) tags.push('推荐');
    if (name.includes('wifi') || name.includes('coffee')) tags.push('WiFi快');
    if (name.includes('quiet') || name.includes('library')) tags.push('安静');
    if (name.includes('coffee')) tags.push('咖啡好');
    if (place.price_level <= 2) tags.push('价格合理');
    if (name.includes('park')) tags.push('环境美');
    if (name.includes('nomad')) tags.push('游民专用');
    if (name.includes('wework')) tags.push('专业');
    if (name.includes('starbucks')) tags.push('连锁');
    
    return tags;
  }
  
  private estimateWifiSpeed(place: any): number {
    const name = place.name.toLowerCase();
    
    if (name.includes('wework')) return 120;
    if (name.includes('starbucks')) return 75;
    if (name.includes('blue bottle')) return 85;
    if (name.includes('library')) return 100;
    if (name.includes('nomad')) return 95;
    
    return Math.floor(Math.random() * 50) + 50; // 50-100 Mbps
  }
  
  private getPriceLevel(level: number): number {
    return level || 2;
  }
  
  private getPriceLevelText(level: number): string {
    switch (level) {
      case 1: return '$';
      case 2: return '$$';
      case 3: return '$$$';
      case 4: return '$$$$';
      default: return '$$';
    }
  }
  
  private estimateNoiseLevel(place: any): 'quiet' | 'moderate' | 'loud' {
    const name = place.name.toLowerCase();
    
    if (name.includes('library') || name.includes('quiet')) return 'quiet';
    if (name.includes('coffee') || name.includes('cafe')) return 'moderate';
    return 'moderate';
  }
  
  private estimateSocialAtmosphere(place: any): 'low' | 'medium' | 'high' {
    const name = place.name.toLowerCase();
    
    if (name.includes('wework')) return 'high';
    if (name.includes('starbucks')) return 'medium';
    if (name.includes('library')) return 'low';
    if (name.includes('nomad')) return 'high';
    return 'medium';
  }
  
  private generateRandomName(): string {
    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
    return names[Math.floor(Math.random() * names.length)];
  }
}

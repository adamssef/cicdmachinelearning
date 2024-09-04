FROM php:8.1-apache
RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT=/var/www/html/docroot
ENV APP_HOME=/var/www/html
RUN apt-get update && apt-get install -y \
    redis-tools \
    git \
    inetutils-ping \
    telnet \
    zip \
    curl \
    vim \
    sudo \
    unzip \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libcurl4-openssl-dev \
    libpng-dev \
    libwebp-dev \
    libwebp-dev \
&& docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
&& docker-php-ext-install -j$(nproc) gd curl pdo_mysql zip

RUN pecl install redis
RUN docker-php-ext-enable redis

COPY entrypoint.sh ./
COPY azure/extensions.ini /usr/local/etc/php/conf.d/
COPY azure/000-default.conf /etc/apache2/sites-available/

# Start and enable SSH
RUN apt-get update \
    && apt-get install -y --no-install-recommends dialog \
    && apt-get install -y --no-install-recommends openssh-server \
    && echo "root:Docker!" | chpasswd \
    && chmod u+x ./entrypoint.sh
RUN ls
COPY sshd_config /etc/ssh/

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# COPY sshd_config /etc/ssh/

COPY . $APP_HOME

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer --version=2.6.6
# Run composer install
WORKDIR /var/www/html

# RUN ln -s /home/files ${APACHE_DOCUMENT_ROOT}/sites/default/files
# RUN chown -R www-data:www-data ${APACHE_DOCUMENT_ROOT}/sites/default/files

RUN git config --global --add safe.directory '*'
RUN composer install --no-interaction --no-progress

RUN chown -R www-data:www-data ${APACHE_DOCUMENT_ROOT}
RUN mkdir -p ${APACHE_DOCUMENT_ROOT}/sites/default/files-private
RUN chmod -R g+w ${APACHE_DOCUMENT_ROOT}/sites/default/files-private

EXPOSE 2222 80

RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]
